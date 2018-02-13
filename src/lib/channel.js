// @flow
export default class Channel {
  static channels: Object = {};

  static createChannel ( cname: string ) {
    if ( this.channels[ cname ] ) throw new Error( 'Channel already registered' );
    this.channels[ cname ] = [];
  }

  static join ( cname: string, client: Object ) {
    if ( !this.channels[ cname ] ) {
      this.channels[ cname ] = [];
    }

    let found = false;

    for ( let i = 0; i < this.channels[ cname ].length; i += 1 ) {
      if ( this.channels[ cname ][ i ].__uid__ === client.__uid__ ) {
        found = true;
        break;
      }
    }

    if ( !found ) return this.channels[ cname ].push( client );
    return false;
  }

  static publish ( message: string, cname: string ) {
    if ( this.channels[ cname ] ) {
      this.channels[ cname ].forEach( ( item ) => {
        item.send( message );
      } );
    }

    return false;
  }

  /**
   * splice disconnected clients from all joined rooms
   *
   * @static
   * @param {string} uuid
   * @param {Array<String>} roomNamesArray
   * @returns {number}
   * @memberof Channel
   */
  static leaveRooms ( uuid: string, roomNamesArray: Array<String> ): number {
    let leavedRoomCounter = 0;

    for ( let i = 0; i < roomNamesArray.length; i += 1 ) {
      const pos = this.channels[ roomNamesArray ].map( item => item.__uid__ ).indexOf( uuid );

      if ( pos < 0 ) continue;

      this.channels[ roomNamesArray ].splice( pos, 1 );
      leavedRoomCounter += 1;
    }

    return leavedRoomCounter;
  }
}
