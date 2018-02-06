import Router from './router';
import Client from './client';
import Cache from './cache';

export default ( sockerServer ) => {
  sockerServer.on( 'connection', ( socket, req ) => {
    const newClient = new Client( socket, req );
    Cache.set( newClient );

    socket.send( 'ping' );
  } );
};

export { Router };
