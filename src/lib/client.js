import Request from './request';

export default class Client extends Request {
  constructor ( socket, req ) {
    super( socket, req );
    this.ip = req.connection.remoteAddress;
    this.at_connected = new Date();
  }
}
