// @flow
import pathToRegexp from 'path-to-regexp';
import __path from 'path';
import { sync } from './utility';
import { PreRequest } from './types';

export default class Router {
  /**
   * Used for check url in each request,
   * match regex in this array.
   */
  routePathRegex: Array<RegExp> = [];

  /**
   * for check already registered raw path string
   */
  routePath: Array<string> = [];

  /**
   * router path handle functions map
   * index is position in routePathIndex of path
   */
  mapping: {[index: string]: Array<Function>} = {};

  /**
   * Router default prefix and prefix regex.
   */
  prefix: string
  prefixRegExp: RegExp;

  constructor ( prefix: string ) {
    this.setPrefix( ( prefix && prefix.length ) ? prefix : '/' );
  }

  register ( path: string, ...args: Array<Function> ) {
    if ( typeof path !== 'string' ) throw new Error( `path is invalid type. [${path}]` );
    if ( !args.length ) throw new Error( `Handle function is not defined path=[${path}]` );

    path = __path.join( this.prefix, path.toLowerCase() );

    const pathIsRegexed = pathToRegexp( path );

    if ( this.routePath.indexOf( path ) >= 0 ) throw new Error( `Route already registered. [${path}]` );

    const index: number = this.routePathRegex.push( pathIsRegexed ) - 1;

    this.routePath.push( path );
    this.mapping[ index.toString() ] = args;

    return true;
  }

  setPrefix ( prefix: string ) {
    this.prefix = prefix;
    this.prefixRegExp = new RegExp( `^${prefix}`, 'i' );
  }

  static runAsyncRequestHandler ( handler: Array<Function>, req: any, res: any ) {
    return sync( handler, req, res );
  }

  findAndGetPathInMap ( pathnameOnReq ) {
    let match: any = null;
    let index: number = 0;

    for ( let i  = 0; i < this.routePathRegex.length; i += 1 ) {
      match = this.routePathRegex[ i ].exec( pathnameOnReq );
      index = i;
      if ( match ) break;
    }

    return { match, index };
  }

  callNextFunctions ( req: PreRequest, res: any ) {
    const { pathname } = req;
    const { match, index } = this.findAndGetPathInMap( pathname );

    if ( !match ) {
      res.send( { statusCode : 404 } );
      return;
    }

    this.constructor.runAsyncRequestHandler( this.mapping[ index.toString() ], req, res )
      .then( () => {
        req.at_finish = Date.now();
      } )
      .catch( ( e ) => {
        console.log( e );
      } );
  }
}
