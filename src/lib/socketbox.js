// @flow
import { EventEmitter } from 'events';
import _Router from './router';
import Route from './route';
import Client from './client';
import Cache from './cache';

/**
 * @private
 */
const onClientIsDead = Symbol( 'onClientIsDead' );

/**
 * @private
 */
const checkAliveSockets = Symbol( 'checkAliveSockets' );

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

    // check which sockets dont response our ping message
    if ( this.boxoptions.ping ) { setInterval( this[ checkAliveSockets ].bind( this ), this.boxoptions.pingTimeout ); }
  }

  [checkAliveSockets] () {
    for ( let j = 0; j < Cache.clientsArray.length; j += 1 ) {
      const client = Cache.clientsArray[ j ];
      if ( !client.getIsAlive() ) {
        this[ onClientIsDead ]( client, j );
        return;
      }

      client.setIsAlive( false );

      const delivered = client.ping();
      if ( !delivered ) {
        this[ onClientIsDead ]( client, j );
      }
    }
  }

  [onClientIsDead] ( client, index ) {
    this.emit( 'disconnected', Object.assign( {}, client ) );
    this.destroyClient( index, client );
  }

  createServer ( socketServer: Object ) {
    this.socketServerRef = socketServer;

    socketServer.on( 'connection', ( socket, req ) => {
      this.onConnected( socket, req );
    } );

    return this;
  }

  destroyClient ( cacheIndex, client ) {
    client.terminate();
    Cache.removeClientByIndex( cacheIndex );

    return this;
  }

  onConnected ( socket: any, req: any ) {
    const newClient = new Client( socket, req );

    Cache.push( newClient );
    this.emit( 'connected', newClient );

    return newClient;
  }

  static Router () {
    return new _Router();
  }

  use ( prefix: string, router: Object ) {
    let __router: Object = {};
    let __prefix: string = '/';

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
