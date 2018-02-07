import WebSocket from 'ws';
import Socketbox from './../dist/socketbox';

const Socketbox1 = require( './../dist/socketbox' );

console.log( Socketbox );
console.log( Socketbox1 );

const ws = new WebSocket.Server( { port : 8080 } );

Socketbox.createServer( ws );

const router = Socketbox.Router();

Socketbox.use( '/', router );

const mid1 = ( req, res, next ) => {
  req.user = {};
  req.user.username = 'dmomer';
  next();
};

const mid2 = ( req, res, next ) => {
  req.user.age = 27;
  next();
};

router.register( '/profile', mid1, ( req, res ) => {
  res.send( req.user );
} );

router.register( '/message/write', mid1, mid2, ( req, res ) => {
  console.log( 'User', req.user );
  res.send( { statusCode : 200 } );
} );
