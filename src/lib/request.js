// @flow

export default class Request {
  /**
   * Client session
   *
   * @type {Object}
   * @memberof Request
   */
  session: Object;

  /**
   * Received message protocol schema is;
   *
   * {                    -
   *  url: '<string>',     |     HEADERS
   *  token: '<string>',   |
   *                      -
   *
   *  body: {             -
   *    a: b               |
   *    .                  |
   *    .                  |     BODY
   *    .                  |
   *  }                    |
   *                      -
   * }
   *
   * @type {Object}
   * @memberof Request
   */
  headers: Object;

  body: Object;

  /**
   * raw message received from client
   *
   * @type {string}
   * @memberof Request
   */
  rawMessage: string;
  atStarted: number;

  /**
   * parse url to it have queries
   *
   * @type {Object}
   * @memberof Request
   */
  query: Object = {};

  /**
   * parse url to it have params
   *
   * @type {Object}
   * @memberof Request
   */
  params: Object = {};

  /**
   * If raw message is object, request is routable
   *
   * @type {true}
   * @memberof Request
   */
  isRoutable: true;

  pathname: string;
  hostname: string;
  href: string;

  constructor ( raw ) {
    this.atStarted = Date.now();
    this.rawMessage = raw;
  }

  setHeaders ( key, value ) {
    if ( !key || !value ) throw new Error( 'setHeaders key & value is required' );

    if ( typeof key !== 'string' || typeof value !== 'string' ) throw new TypeError( 'setHeaders key & value type should be string' );

    this.headers[ key ] = value;
  }
}
