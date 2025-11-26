import routes from './routes.js';
import SongsHandler from './handler.js';

const songs = {
  name: 'songs',
  register: (server, { service, validator }) => {
    const handler = new SongsHandler(service, validator);
    server.route(routes(handler));
  },
};

export default songs;
