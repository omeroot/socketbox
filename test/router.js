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
        res.send('dmomer');
      });

      assert(router.routePath.indexOf(path) >= 0);
      assert(router.mapping['0'].length > 0);

      const { match, index } = router.findAndGetPathInMap( '/test' );
      assert(match !== null);
      assert(index === 0);

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
    })
  });
});