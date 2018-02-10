import assert from 'assert';
import net from 'net';
import WebSocket from 'ws';

import Socketbox from './../src'
import Router from './../src/lib/router';
import Client from './../src/lib/client';

describe('Socketbox app', () => {
  describe('Socketbox with options', () => {
    it('pingTimeout is not number', () => {
      assert.throws(() => new Socketbox({
        ping: true,
        pingTimeout: 'aab'
      }));
    });
  });
  describe('Socketbox methods', () => {
    it('createServer', (done) => {
      const app = new Socketbox();
      const wss = new WebSocket.Server({port: 8081});
      const scope = app.createServer(wss);

      assert(scope instanceof Socketbox);
      wss.close(done);
    });

    it('Get router', (done) => {
      const r = Socketbox.Router();

      assert(r instanceof Router);
      done();
    });

    it('onConnected', (done) => {
      const app = new Socketbox();
      const wss = new WebSocket.Server({port: 8081}, () => {
        const ws = new WebSocket('ws://localhost:8081');
      });
      const scope = app.createServer(wss);

      scope.on('connected', (client) => {
        assert(client instanceof Client);
        wss.close(done);
      });
    });

    describe('use', (done) => {
      it('without params', (done) => {
        const app = new Socketbox();
        assert(app.use() === false);
        done();
      });

      it('only router', (done) => {
        const app = new Socketbox();
        const r = new Socketbox.Router();
        app.use(r);

        assert(r.prefix === '/');
        done();
      });
    })
  });
});