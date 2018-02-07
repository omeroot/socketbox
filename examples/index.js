import WebSocket from 'ws';
import Horn from './../src';

const ws = new WebSocket.Server( { port : 8080 } );

Horn.createServer( ws );

const router = Horn.Router();

Horn.use( '/', router );

const mid1 = ( req, res, next ) => {
  req.user = {};
  req.user.username = 'dmomer';
  next();
};

const mid2 = ( req, res, next ) => {
  req.user.age = 27;
  next();
};

router.register( '/message/write', mid1, mid2, ( req, res ) => {
  console.log( 'User', req.user );
  res.send( { statusCode : 200 } );
} );
