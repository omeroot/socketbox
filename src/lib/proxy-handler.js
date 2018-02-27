// @flow
import Router from './router';

export default class ProxyHandler {
  static mountedHandler: Map<string, Router> = new Map();

  static add ( targetPath: string | Function, fn: Function ) {
    let _fn;
    let path = '/';

    if ( !targetPath ) return false;

    if ( !fn ) {
      _fn = targetPath;
    } else {
      _fn = fn;
      path = targetPath;
    }

    if ( typeof path !== 'string' || !path.length ) throw new TypeError( 'use method path should be string.' );
    if ( typeof _fn !== 'function' && !( _fn instanceof Router ) ) throw new TypeError( 'use method requires function or router instance.' );
    if ( this.mountedHandler.has( path ) && _fn instanceof Router ) throw new Error( 'router already cached.' );

    if ( this.mountedHandler.has( path ) ) {
      const _router = this.mountedHandler.get( path );
      _router.middleware.push( _fn );
      return true;
    }

    if ( _fn instanceof Router ) {
      _fn.setPrefix( path );
      this.mountedHandler.set( path, _fn );
      return true;
    }

    const newRouter = new Router( path );

    newRouter.middleware.push( _fn );
    this.mountedHandler.set( path, newRouter );

    return true;
  }

  static async callProxyHandlers ( req, res ) {
    const iterator = this.mountedHandler.entries();

    const runner = () => {
      const v = iterator.next();

      if ( !v.done ) {
        const _router = v.value[ 1 ];
        _router.prehandler( req, res, runner );
        return;
      }

      res.send( { statusCode : 404, error : 'Not found', message : 'url is not defined' } );
    };

    runner();
  }
}
