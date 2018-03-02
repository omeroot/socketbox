import assert from 'assert';
import ProxyHandler from './../src/lib/proxy-handler';
import Socketbox from '../src';

describe('ProxyHandler', () => {
  describe('add', () => {
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
        next();
        done();
      }

      ProxyHandler.add(f1);

      ProxyHandler.callProxyHandlers({pathname: '/'},{
        send: function(){}
      });
    });
  });

  describe('calling', () => {
    it('callProxyHandlers - only use functions', (done) => {
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
  
    it('callProxyHandlers - mixed / and different router', (done) => {
      // clear add functions
      ProxyHandler.mountedHandler.clear();
      const result = [];
  
      const f1 = (req, res, next) => {
        result.push('1');
        next();
      }
  
      const f2 = (req, res, next) => {
        result.push('2');
        next();
      }
  
      const apif1 = (req, res) => {
        assert(result[0] === '1');
        assert(result[1] === '2');
        done();
      }
  
      ProxyHandler.add(f1);
      ProxyHandler.add('/', f2);
      ProxyHandler.add('/api/v1', apif1);
  
      ProxyHandler.callProxyHandlers({pathname: '/api/v1'},{
        send: function(){
        }
      });
    });
  
    it('callProxyHandlers - mixed / and other router - other router but not found', (done) => {
      // clear add functions
      ProxyHandler.mountedHandler.clear();
      const result = [];
  
      const f1 = (req, res, next) => {
        result.push('1');
        next();
      }
  
      const f2 = (req, res, next) => {
        result.push('2');
        next();
      }
  
      const apif1 = (req, res, next) => {
        result.push('99');
        next();
      }
  
      ProxyHandler.add(f1);
      ProxyHandler.add('/', f2);
      ProxyHandler.add('/api/v1', apif1);
  
      ProxyHandler.callProxyHandlers({pathname: '/api/v1/user/list'},{
        send: function(_404Response){
          assert(result[0] === '1');
          assert(result[1] === '2');
          assert(result[2] === '99');
          assert(_404Response.statusCode === 404);
          done();
        }
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
});