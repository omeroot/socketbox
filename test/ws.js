import WebSocket from 'ws';
import Horn from './../src'

describe('Horn', () => {
  let wss = null;
  
  before(() => {
    wss = new WebSocket.Server( { port : 8080 } );
    console.debug('Websocket listen=[8080]');
  });

  describe( 'Horn app instance', () => {
    it( 'create horn app with ws', ( done ) => {
      const app = Horn.createServer(wss);
      done();
    } );
  } );
  
  describe('Horn router', () => {
    let router = null;
  
    it('create router', (done) => {
      router = new Horn.Router();
      done();
    });
  
    it('create static url ex: /user', (done) => {
      router.register('/user');
      done();
    });
  });
  
  describe('Horn request', () => {
    let wssClient = null;
  
    before(() => {
      return new Promise((resolve) => {
        wssClient = new WebSocket('ws://localhost:8080');
        wssClient.on('open', () => {
          resolve();
        })
      })
    })

    it('/user', (done) => {
      wssClient.send(JSON.stringify({url: '/user'}));
      done();
    })
  })
  
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
});