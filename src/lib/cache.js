// @flow
import Client from './client';

export default class Cache {
  static clientsMap: Map<string, Client> = new Map();

  static sPush ( key: string, client: Client ) {
    this.clientsMap.set( key, client );
  }

  static sGet ( key: string ): Client {
    return this.clientsMap.get( key );
  }

  static clients (): Array<Client> {
    return Array.from( this.clientsMap ).map( item => item[ 1 ] );
  }

  static filter ( key: string | Function ): Array<Client> {
    if ( !key ) return [];
    let _filter;

    if ( typeof key === 'function' ) {
      _filter = key;
    } else {
      _filter = item => item[ 0 ] === key;
    }

    return [...this.clientsMap].filter( _filter ).map( item => item[ 1 ] );
  }

  static clearClient ( uuid: string ) {
    this.clientsMap.delete( uuid );
  }
}
