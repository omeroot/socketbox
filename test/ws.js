import WebSocket from 'ws';
import Horn from './../src'

describe( 'Horn app instance', () => {
  let wss = null;

  before(() => {
    wss = new WebSocket.Server( { port : 8080 } );
    console.debug('Websocket listen=[8080]');
  });

  it( 'create horn app with ws', ( done ) => {
    const app = Horn(wss);
    done();
  } );
} );

describe( 'Horn client', () => {
  let wssClient = null;

  before(() => {
    wssClient = new WebSocket('ws://localhost:8080');
  });

  it( 'receive ping message', ( done ) => {
    wssClient.on('message', function incoming(data) {
      done();
    });
  } );
} );