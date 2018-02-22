import assert from 'assert';

import {randomString, sync} from './../src/lib/utility';

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
        assert(result.length === 0);
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
});