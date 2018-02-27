// @flow
import crypto from 'crypto';
import Cache from './cache';
import Channel from './channel';
import ProxyHandler from './proxy-handler';
import Request from './request';
import { deserialize } from './utility';

export default class Client {
  __uid__: string = crypto.randomBytes( 12 ).toString( 'hex' );

  ip: string;
  atConnected: Date;
  session: Object;
  socket: Object;
  isAlive: Boolean;
  rooms: Array<string>;

  /**
   * Creates an instance of Client.
   * Only use static methods of ProxyHandler class.
   *
   * @param {*} socket raw socket object.
   * @param {*} req upgraded http request object.
   * @memberof Client
   */
  constructor ( socket: any, req: any ) {
    this.ip = req.connection.remoteAddress;
    this.atConnected = new Date();
    this.session = {};
    this.socket = socket;
    this.isAlive = true;
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

  /**
   * Check message and convert to string , it is referable
   *
   * @static
   * @param {*} message
   * @returns
   * @memberof Client
   */
  static serializeMessage ( message: any ) {
    let raw = '';

    if ( typeof message === 'object' ) {
      raw = JSON.stringify( message );
    } else {
      raw = message.toString() || '';
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
    } catch ( error ) { /* error */ console.log( error ); }
  }

  /**
   * If received data is not object type, return error -> bad request
   * If received data has not url, return error -> 404 not found
   * User can only accept the non-object message on middleware -> app.use() methods
   *
   * @param {string} message received raw string message
   * @returns
   * @memberof Client
   */
  async handle ( message: string ) {
    try {
      const request = new Request( message );

      deserialize( request, this, () => {
        /**
         * only call on all request message.
         * dont support handler, which has request path!!
         */
        ProxyHandler.callProxyHandlers( request, this );
      } );
    } catch ( error ) {
      this.send( { statusCode : 500, message : error.message } );
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

  handleError ( error ) {
    console.log( `Error: ${error} - ${this.ip}` );
    Cache.clearClient( this.__uid__ );
    Channel.leaveRooms( this.__uid__, this.rooms );
  }

  handleClose () {
    Cache.clearClient( this.__uid__ );
    Channel.leaveRooms( this.__uid__, this.rooms );
  }

  listen () {
    this.socket.on( 'message', this.handle.bind( this ) );
    this.socket.on( 'error', this.handleError.bind( this ) );
    this.socket.on( 'close', this.handleClose.bind( this ) );
  }
}
