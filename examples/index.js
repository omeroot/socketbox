import WebSocket from 'ws';
import Socketbox from './../dist/socketbox';

const ws = new WebSocket.Server( { port : 8080, clientTracking : false } );

const app = new Socketbox( {
  ping        : true,
  pingTimeout : 4 * 1000,
} );
app.createServer( ws );

const router = Socketbox.Router();
app.use( '/', router );

app.on( 'connected', ( client ) => {
  console.log( `${client.ip} connected` );
} );

// this client clone of user client
app.on( 'disconnect', ( client ) => {
  console.log( `${client.ip} disconnected` );
} );


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

router.register( '/login', ( req, res ) => {
  req.session.name = 'omer';
  res.send( 'login is success!' );
} );

