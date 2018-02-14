import assert from 'assert';
import WebSocket from 'ws';

import Socketbox from './../src'
import Router from './../src/lib/router';
import Client from './../src/lib/client';
import Cache from './../src/lib/cache';

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

    it('Get cache', (done) => {
      const c1 = Socketbox.Cache();
      const c2 = Socketbox.Cache();

      assert.deepEqual(c1, Cache);
      assert.deepEqual(c2, Cache);

      const client = { __uid__ : '111'};
      
      c1.sPush('1', client);
      assert.deepEqual(c2.sGet('1'), client);

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