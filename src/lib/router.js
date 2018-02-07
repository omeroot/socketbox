// @flow
import pathToRegexp from 'path-to-regexp';
import { sync } from './utility';

export default class Router {
  routePath: Array<string> = [];
  mapping: {[index: string]: Array<Function>} = {};
  prefix: string
  prefixRegExp: RegExp;

  register ( path: string, ...args: Array<Function> ) {
    if ( typeof path !== 'string' ) throw new Error( `path is invalid type. [${path}]` );
    if ( this.routePath.indexOf( path ) >= 0 ) throw new Error( `Route already registered. [${path}]` );
    if ( !args.length ) throw new Error( `Handle function is not defined path=[${path}]` );

    path = path.toLowerCase();

    const index: number = this.routePath.push( pathToRegexp( path ) ) - 1;
    this.mapping[ index.toString() ] = args;

    return true;
  }

  setPrefix ( prefix: string ) {
    this.prefix = prefix;
    this.prefixRegExp = new RegExp( `^${prefix}`, 'i' );
  }

  runAsyncRequestHandler ( handler: Array<Function>, req: any, res: any ) {
    sync( handler, req, res );
    return this;
  }

  callNextFunctions ( req: any, res: any ) {
    const { pathname } = req;
    let match: any = null;
    let index: number = 0;

    for ( let i  = 0; i < this.routePath.length; i += 1 ) {
      match = this.routePath[ i ].exec( pathname );
      index = i;
      if ( match ) break;
    }

    if ( !match ) {
      return res.send( { statusCode : 404 } );
    }

    return this.runAsyncRequestHandler( this.mapping[ index.toString() ], req, res );
  }
}
