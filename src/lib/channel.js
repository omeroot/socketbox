// @flow
export default class Channel {
  static channels: Object = {};

  static createChannel ( cname: string ) {
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

    if ( !found ) this.channels[ cname ].push( client );
  }

  static publish ( message: string, cname: string ) {
    if ( this.channels[ cname ] ) {
      this.channels[ cname ].forEach( ( item ) => {
        item.send( message );
      } );
    }

    return false;
  }
}
