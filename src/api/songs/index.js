import routes from './routes.js';
import SongsHandler from './handler.js';

const songs = {
  name: 'songs',
  version: '1.0.0',
  register: (server, { service }) => {
    const handler = new SongsHandler(service);
    server.route(routes(handler));
  },
};

export default songs;
