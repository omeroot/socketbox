// @flow
import Client from './client';

export default class Cache {
  static map = {};
  static set ( client: Client ) {
    this.map[ client.session ] = Client;
  }
}
