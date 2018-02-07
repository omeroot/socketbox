// @flow
import _Router from './router';
import Route from './route';
import Client from './client';
import Cache from './cache';

export default class Horn {
  static socketServerRef: Object;

  static createServer ( socketServer: Object ) {
    this.socketServerRef = socketServer;

    socketServer.on( 'connection', ( socket, req ) => {
      this.onConnected( socket, req );
      socket.send( 'ping' );
    } );
  }

  static onConnected ( socket: any, req: any ) {
    const newClient = new Client( socket, req );
    Cache.set( newClient );
    return newClient;
  }

  static Router () {
    return new _Router();
  }

  static use ( prefix: string, router: Object ) {
    let __router: Object = {};
    let __prefix: string = '/';

    if ( !router ) {
      __router = router;
    } else {
      __prefix = prefix;
      __router = router;
    }

    __router.setPrefix( __prefix );
    Route.activateRouter( __router );
  }
}
