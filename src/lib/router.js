// @flow
import Request from './request';

export default class Router {
  static instance = null;

  routePath: Array<string> = [];
  mapping: {[index: string]: Array<Function>} = {};

  constructor () {
    if ( !Router.instance ) Router.instance = new Router();
    return Router.instance;
  }

  register ( path: string, ...args: Array<Function> ) {
    if ( this.routePath.indexOf( path ) >= 0 ) throw Error( `Route already registered. [${path}]` );

    const index: number = this.routePath.push( path );
    this.mapping[ index.toString() ] = args;
  }

  callNextFunctions ( coming: any, req: Request, res: any ) {
    const pointer = this.routePath.indexOf( coming.url );
    console.log( pointer );
  }
}
