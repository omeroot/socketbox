import assert from 'assert';
import ProxyHandler from './../src/lib/proxy-handler';

describe('ProxyHandler', () => {
  describe('add', (done) => {
    it('add empty parameter', (done) => {
      assert(ProxyHandler.add() === false);
      done();
    });

    it('non-function parameters', (done) => {
      assert.throws(() => ProxyHandler.add(1,2,3));
      done();
    });

    it('add single function', (done) => {
      ProxyHandler.mountedHandler.clear();

      var f1 = (req, res, next) => {
        done();
      }

      ProxyHandler.add(f1);

      ProxyHandler.callProxyHandlers({pathname: '/'},{
        send: function(){}
      });
    });
  });

  it('callProxyHandlers without response - use only middleware', (done) => {
    // clear add functions
    ProxyHandler.mountedHandler.clear();
    const result = [];

    const f1 = (req, res, next) => {
      result.push('1');
      next();
    }

    const f2 = (req, res, next) => {
      result.push('2');
      assert(result[0] === '1');
      assert(result[1] === '2');
      done();
    }

    ProxyHandler.add(f1);
    ProxyHandler.add(f2);

    ProxyHandler.callProxyHandlers({pathname: '/'},{
      send: function(){}
    });
  });

  it('callProxyHandlers 404 Notfound', (done) => {
    // clear add functions
    ProxyHandler.mountedHandler.clear();

    ProxyHandler.callProxyHandlers({pathname: '/'},{
      send: function(v){
        assert(v.statusCode === 404);
        done();
      }
    });
  });
});