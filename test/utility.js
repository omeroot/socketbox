import assert from 'assert';

import {randomString, sync, urlParser, deserialize, pingPong} from './../src/lib/utility';
import Request from './../src/lib/request';

describe('Utility', () => {
  describe('randomString', () => {
    it('randomString', (done) => {
      var s = randomString();
  
      assert(s.length === 12);
      assert(typeof s === 'string');
  
      done();
    });
  
    it('randomString with length', (done) => {
      var s = randomString(21);
  
      assert(s.length === 21);
      assert(typeof s === 'string');
  
      done();
    });
  });

  describe('sync', () => {
    it('empty array', (done) => {
      sync([]).then((result) => {
        assert(result === undefined);
        done();
      });
    });

    it('Run sync reject', (done) => {
      sync('f1', {}, {}).catch(() => {
        done();
      });
    })

    it('Run sync', (done) => {
      var f1 = (req, res, next) => {
        req.prev = [];
        req.prev.push('f1');
        next();
      }

      var f2 = (req, res, next) => {
        req.prev.push('f1');
        next();
      }

      var handler = (req, res) => {
        assert(req.prev.indexOf('f1') >= 0);
        assert(req.prev.indexOf('f2') >= 0);
      }

      // simulate
      // second parameter = req
      // third parameter = res
      sync([f1, f2], {}, {}).then(() => {
        done();
      })
    });
  });

  describe('urlParser', () => {
    it('Query parse', (done) => {
      const raw = JSON.stringify({url: 'ws://omer.app/api/v1?keyword=25&width=40&height=124.33'})
      const req = new Request(raw);
      const res = {};

      deserialize(req, res, () => {
        urlParser(req, {}, function(){
          assert(req.query.keyword === '25');
          assert(req.query.width === '40');
          assert(req.query.height === '124.33');
      
          done();
        });
      });
    });

    it('Non routable', (done) => {
      const raw = 'omer';
      const req = new Request(raw);
      const res = {};

      deserialize(req, res, () => {
        assert(urlParser(req) === false);
        done();
      });
    });
  });

  describe('pingPong', () => {
    it('Is pingPong message', (done) => {
      const req = new Request('pong');
      const res = {
        heartbeat: function(){
          done();
        }
      }

      pingPong(req, res);
    });

    it('Not pingPong message', (done) => {
      const req = new Request('socketbox');
      const res = {};

      pingPong(req, res, done);
    });
  });

  describe('deserialize', () => {
    it('string', (done) => {
      const req = new Request('ping');

      deserialize(req, {}, () => {
        assert(req.isRoutable === false);
        assert(req.body === undefined);
        assert(req.headers === undefined);
        assert(req.rawMessage === 'ping');
        done();
      });
    });

    it('json', (done) => {
      const raw = JSON.stringify({url: '/message/write', body: {text: 'hi!'}});
      const req = new Request(raw);
      
      deserialize(req, {}, () => {});
      assert(req.isRoutable === true);
      assert.deepEqual(req.body, {text: 'hi!'});
      assert.deepEqual(req.headers, {url: '/message/write', body: undefined});
      done();
    });

    it('null', (done) => {
      const req = new Request();
      deserialize(req, {}, () => {
        assert(req.rawMessage === undefined);
        done();
      });
    });
  })
});