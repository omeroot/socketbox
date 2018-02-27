// @flow
/* eslint no-restricted-syntax: 0 */
/* eslint no-await-in-loop: 0 */
import Router from './router';

export default class ProxyHandler {
  static mountedHandler: Map<string, Array<Function>> = new Map();

  static add ( targetPath: string | Array<Function>, ...funcArr: Array<Function> ) {
    let funcs;
    let path = '/';

    if ( !targetPath ) return false;

    if ( !funcs ) {
      funcs = path;
    } else {
      funcs = funcArr;
      path = targetPath;
    }

    if ( !Array.isArray( funcs ) || !funcs.length ) return false;

    funcs.forEach( ( fn ) => {
      if ( typeof fn !== 'function' || fn instanceof Router ) throw new TypeError( 'use method requires function or router instance' );

      let _fn;

      if ( fn instanceof Router ) {
        fn.setPrefix( path );
        _fn = fn.handler;
      } else {
        _fn = fn;
      }

      this.mountedHandler.set( path, _fn );
    } );

    return funcs.length;
  }

  static runner ( _tupple: Array, req, res ) {
    return new Promise( ( approve ) => {
      _tupple[ 1 ]( req, res, approve );
    } );
  }

  static async callProxyHandlers ( req, res ) {
    let isNotFound = true;

    for ( const tuple of this.mountedHandler ) {
      const found = await this.runner( tuple, req, res );
      if ( found && req.isRoutable ) isNotFound = false;
    }

    if ( isNotFound ) res.send( { statusCode : 404, error : 'Not found', message : 'url is not defined' } );
  }
}
