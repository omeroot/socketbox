import WebSocket from 'ws';
import Horn from './../src';

const wss = new WebSocket.Server( { port : 8080 } );

Horn.createServer( wss );

const router = new Horn.Router();

router.register( '/omer', ( req, res ) => {
  console.log( 'OMER' );
} );
