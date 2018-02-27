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

      return true;
    }

    return false;
  }

  /**
   * Splice given client with this uuid from given room with cname
   * If client joined this room, return true otherwise return false;
   *
   * @static
   * @param {string} cname
   * @param {string} uuid
   * @returns {boolean}
   * @memberof Channel
   */
  static spliceClientFromRoom ( cname: string, uuid: string ): boolean {
    const pos = this.channels[ cname ].map( item => item.__uid__ ).indexOf( uuid );

    if ( pos < 0 ) return false;

    this.channels[ cname ].splice( pos, 1 );
    return true;
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
      const success = this.spliceClientFromRoom( roomNamesArray[ i ], uuid );
      if ( success ) leavedRoomCounter += 1;
    }

    return leavedRoomCounter;
  }
}
