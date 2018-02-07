// @flow
import { parse as URLparse, URL } from 'url';
import crypto from 'crypto';
import Route from './route';

export default class Client {
  ip: string;
  atConnected: Date;
  session: Object;
  socket: Object;
  req: Object;

  constructor ( socket: any, req: any ) {
    this.ip = req.connection.remoteAddress;
    this.atConnected = new Date();
    this.session = { _id : crypto.randomBytes( 12 ).toString( 'hex' ) };
    this.socket = socket;
    this.req = req;

    /**
     * listen client messages
     */
    this.listen();
  }

  send ( message: any ) {
    let raw = '';

    if ( typeof message === 'object' ) {
      raw = JSON.stringify( message );
    } else {
      raw = message;
    }

    this.socket.send( raw );
  }

  request ( body: Object, atStarted: number ) {
    const urlDelegate = URLparse( body.url );
    const urlObject = new URL( body.url );

    let obj = Object.assign( {}, this.req );
    obj = Object.assign( obj, urlDelegate );

    obj.body = body;
    obj.url = body.url;
    obj.query = {};
    obj.params = {};
    obj.at_started = atStarted;

    urlObject.searchParams.forEach( ( value, name ) => {
      obj.query[ name ] = value;
    } );

    return obj;
  }

  handle ( message: string ) {
    try {
      const atStarted = Date.now();
      const json = JSON.parse( message );

      if ( !json.url || !json.url.length ) throw Error( 'url is not defined' );

      Route.routeTo( this.request( json, atStarted ), this );
    } catch ( error ) {
      console.log( error );
      this.send( { err : true } );
    }
  }

  listen () {
    this.socket.on( 'message', this.handle.bind( this ) );
  }
}
