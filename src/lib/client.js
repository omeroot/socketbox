// @flow
import { parse as URLparse, URL } from 'url';
import crypto from 'crypto';
import Route from './route';
import Cache from './cache';
import Channel from './channel';

export default class Client {
  __uid__: string = crypto.randomBytes( 12 ).toString( 'hex' );

  ip: string;
  atConnected: Date;
  session: Object;
  socket: Object;
  req: Object;
  isAlive: Boolean;
  reference: Symbol;
  rooms: Array<string>;

  constructor ( socket: any, req: any ) {
    this.ip = req.connection.remoteAddress;
    this.atConnected = new Date();
    this.session = {};
    this.socket = socket;
    this.req = req;
    this.isAlive = true;
    this.reference = Symbol( this.__uid__ );
    this.rooms = [];

    /**
     * listen client messages
     */
    this.listen();
  }

  // TODO: make private
  /**
   * Add rooms to client joined room array.
   * We gonna use this rooms for leave from room,
   * If user is disconnected.
   *
   * @param {string} cname
   * @returns {number}
   * @memberof Client
   */
  addRoomToJoinedRoom ( cname: string ): number {
    let index = this.rooms.indexOf( cname );

    if ( index < 0 ) index = this.rooms.push( cname ) - 1;
    return index;
  }

  join ( cname: string ) {
    this.addRoomToJoinedRoom( cname );
    return Channel.join( cname, this );
  }

  static serializeMessage ( message: any ) {
    let raw = '';

    if ( typeof message === 'object' ) {
      raw = JSON.stringify( message );
    } else {
      raw = message || '';
    }

    return raw;
  }

  leave ( cname ) {
    const index = this.rooms.indexOf( cname );

    if ( index < 0 ) return false;
    this.rooms.splice( index, 1 );
    Channel.spliceClientFromRoom( cname, this.__uid__ );

    return true;
  }

  sendTo ( message: any, cname: string ) {
    Channel.publish( this.constructor.serializeMessage( message ), cname );
  }

  send ( message: any ) {
    try {
      this.socket.send( this.constructor.serializeMessage( message ) );
    } catch ( error ) { /* error */ }
  }

  request ( messageObject: Object, atStarted: number ) {
    const urlDelegate = URLparse( messageObject.url );
    const urlObject = new URL( messageObject.url );

    let obj = Object.assign( {}, this.req );
    obj = Object.assign( obj, urlDelegate );

    obj.headers = Object.assign( {}, messageObject, { body : undefined } );
    obj.body = messageObject.body;
    obj.query = {};
    obj.params = {};
    obj.at_started = atStarted;

    // reference client session to each request
    obj.session = this.session;

    urlObject.searchParams.forEach( ( value, name ) => {
      obj.query[ name ] = value;
    } );

    return obj;
  }

  handle ( message: string ) {
    try {
      if ( message === 'pong' ) return this.heartbeat();

      const atStarted = Date.now();
      const json = JSON.parse( message );

      if ( !json.url || !json.url.length ) throw Error( 'url is not defined' );

      return Route.routeTo( this.request( json, atStarted ), this );
    } catch ( error ) {
      return this.send( { statusCode : 401, message : error.message } );
    }
  }

  heartbeat () {
    this.isAlive = true;
  }

  setIsAlive ( val: Boolean ) {
    this.isAlive = val;
  }

  getIsAlive (): Boolean {
    return this.isAlive;
  }

  terminate (): Boolean {
    this.socket.terminate();
  }

  ping (): Boolean {
    try {
      this.send( 'ping' );
    } catch ( error ) { console.log( error ); return false; }

    return true;
  }

  // interface
  noop () {
    return this;
  }

  handleError ( error ) {
    console.log( `Error: ${error} - ${this.ip}` );
    Cache.removeClient( this.__uid__ );
    Channel.leaveRooms( this.__uid__, this.rooms );
  }

  handleClose () {
    Cache.removeClient( this.__uid__ );
    Channel.leaveRooms( this.__uid__, this.rooms );
  }

  listen () {
    this.socket.on( 'message', this.handle.bind( this ) );
    this.socket.on( 'error', this.handleError.bind( this ) );
    this.socket.on( 'close', this.handleClose.bind( this ) );
  }
}
