import assert from 'assert';
import pathToRegexp from 'path-to-regexp';

import Router from './../src/lib/router';

describe('Router', () => {
  describe('Register', () => {
    it('register without path', () => {
      const router = new Router();
      assert.throws(() => router.register());
    });

    it('path is invalid', () => {
      const router = new Router();
      assert.throws(() => router.register(12));
    });

    it('handle is not defined', () => {
      const router = new Router();
      assert.throws(() => router.register('/test'));
    });

    it('success register', (done) => {
      const router = new Router();
      const path = '/test';
      
      router.register(path, (req, res) => {
        res.send('handler');
      });

      assert(router.routePath.indexOf(path) >= 0);
      assert(router.mapping['0'].length > 0);

      const { match, index } = router.findAndGetPathInMap( '/test' );
      assert(match !== null);
      assert(index === 0);

      done();
    });

    it('success register same path', (done) => {
      const router = new Router();
      const path = '/test';
      
      router.register(path, function handler1(req, res){
        res.send('handler1');
      });

      router.register(path, function handler2(req, res){
        res.send('handler2');
      });

      assert(router.mapping['0'].length === 2);
      assert(router.mapping['0'][0].name === 'handler1');
      assert(router.mapping['0'][1].name === 'handler2');
      done();
    })
  });

  describe('Methods', () => {
    it('Set prefix', (done) => {
      const router = new Router();
      router.setPrefix('/api/v1');
  
      assert(router.prefix === '/api/v1');

      const regex = pathToRegexp('/api/v1',[], {
        sensitive : true,
        strict    : false,
        end       : false,
      });

      assert( String(router.prefixRegExp) === String(regex));
      done();
    });

    it('use with array', (done) => {
      const router = new Router();

      const f1 = function f1(req, res, next){
        next();
      }

      const f2 = function f2(req, res, next){
        next();
      }

      router.use([f1, f2]);

      assert(router.middleware.length === 2);
      assert(router.middleware[0].name === 'f1');
      assert(router.middleware[1].name === 'f2');
      done();
    });

    it('use with array contains invalid argument', (done) => {
      const router = new Router();

      const f1 = function f1(req, res, next){
        next();
      }
      const f2 = 'f2'

      assert.throws(() => router.use([f1, f2]));
      done();
    });

    it('use with single function', (done) => {
      const router = new Router();

      const f1 = function f1(req, res, next){
        next();
      }

      router.use(f1);

      assert(router.middleware.length === 1);
      assert(router.middleware[0].name === 'f1');
      done();
    });

    it('use invalid argument', (done) => {
      const router = new Router();
      assert.throws(() => router.use(11));
      done();
    });
  
    describe('callNextFunctions', () => {
      it('404 status', (done) => {
        const r = new Router();

        r.register('/message/write', () =>{});

        const req = {pathname: '/message/send'};
        const res = {};

        const promise = Promise.resolve(r.callNextFunctions(req, res));

        promise.then((v) => {
          assert( v === false);
          done();
        });
      });

      it('200 status', (done) => {
        const r = new Router();

        r.register('/message/write', (req, res) =>{
          done();
        });

        const req = {pathname: '/message/write'};
        const res = {};
        const promise = Promise.resolve(r.callNextFunctions(req, res));

        promise.then((v) => {
          assert( v === true);
          done();
        });
      });
    });
  });
});