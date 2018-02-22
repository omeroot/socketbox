// @flow
/* eslint no-restricted-syntax: 0 */
import { EventEmitter } from 'events';
import _Router from './router';
import Route from './route';
import Client from './client';
import Cache from './cache';
import Proxy from './proxy';

export default class Socketbox extends EventEmitter {
  // default box options
  boxoptions: Object = {
    ping        : false,
    pingTimeout : 20 * 1000, // second
  };

  // server reference object
  socketServerRef: Object;

  constructor ( options: Object ) {
    super();

    this.boxoptions = Object.assign( this.boxoptions, options );

    if ( this.boxoptions.ping ) {
      if ( typeof this.boxoptions.pingTimeout !== 'number' ) { throw new TypeError( 'pingTimeout type must be number' ); }

      Proxy.add( ( req, res, next ) => {
        if ( req.rawMessage === 'pong' ) {
          res.heartbeat();
          return;
        }

        next();
      } );

      setInterval( this.checkAliveSockets.bind( this ), this.boxoptions.pingTimeout );
    }
  }

  static Router () {
    return new _Router();
  }

  static Cache () {
    return Cache;
  }

  pre ( ...funcs ) {
    Proxy.add( funcs );
    return this;
  }

  checkAliveSockets () {
    for ( const client of Cache.clientsMap.values() ) {
      if ( !client.getIsAlive() ) {
        this.onClientIsDead( client );
        return;
      }

      client.setIsAlive( false );

      const delivered = client.ping();
      if ( !delivered ) {
        this.onClientIsDead( client );
      }
    }
  }

  onClientIsDead ( client ) {
    this.destroyClient( client );
    this.emit( 'disconnected', Object.assign( {}, client ) );
  }

  createServer ( socketServer: Object ) {
    this.socketServerRef = socketServer;

    socketServer.on( 'connection', ( socket, req ) => {
      this.onConnected( socket, req );
    } );

    return this;
  }

  destroyClient ( client ) {
    client.terminate();
    Cache.clearClient( client.__uid__ );

    return this;
  }

  onConnected ( socket: any, req: any ) {
    const newClient = new Client( socket, req );

    Cache.sPush( newClient.__uid__, newClient );
    this.emit( 'connected', newClient );

    return newClient;
  }

  use ( prefix: string, router: Object ) {
    let __router: Object = {};
    let __prefix: string = '/';

    if ( !prefix ) {
      return false;
    }

    if ( !router ) {
      __router = prefix;
    } else {
      __prefix = prefix;
      __router = router;
    }

    __router.setPrefix( __prefix );
    Route.activateRouter( __router );

    return this;
  }
}
