import crypto from 'crypto';
import Router from './router';

export default class Request {
  constructor ( socket, req ) {
    this.session = { _id : crypto.randomBytes( 12 ).toString( 'hex' ) };
    this.socket = socket;
    this.req = req;
    this.router = new Router();

    this.listen();
  }

  handle ( message ) {
    try {
      const json = JSON.parse( message );
      this.router.callNextFunctions( json, this.req, this.socket );

      console.log( json );
    } catch ( error ) {
      console.log( error );
      this.send( { err : true } );
    }
  }

  listen () {
    this.socket.on( 'message', this.handle );
  }
}
