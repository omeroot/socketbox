import WebSocket from 'ws';
import Socketbox from './../src'

describe('Socketbox', () => {
  let wss = null;
  
  before(() => {
    wss = new WebSocket.Server( { port : 8080 } );
    console.debug('Websocket listen=[8080]');
  });

  describe( 'Socketbox app instance', () => {
    it( 'create socketbox app with ws', ( done ) => {
      const app = Socketbox.createServer(wss);
      done();
    } );
  } );
  
  describe('Socketbox router', () => {
    let router = null;
  
    it('create router', (done) => {
      router = new Socketbox.Router();
      done();
    });
  
    it('create static url ex: /user', (done) => {
      router.register('/user');
      done();
    });
  });
  
  describe('Socketbox request', () => {
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
  
  describe( 'Socketbox client', () => {
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