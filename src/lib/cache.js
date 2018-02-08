// @flow
import Client from './client';

export default class Cache {
  static clientsArray: Array<Client> = [];

  static push ( client: Client ) {
    this.clientsArray.push( client );
  }

  static clients (): Array<Client> {
    return this.clientsArray;
  }

  static removeClientByIndex ( index: int ) {
    this.clientsArray.splice( index, 1 );
  }

  static removeClient ( uid: string ) {
    for ( let i = 0; i < this.clientsArray.length; i += 1 ) {
      if ( this.clientsArray[ i ].__uid__ === uid ) {
        this.clientsArray.splice( i, 1 );
        break;
      }
    }
  }
}
