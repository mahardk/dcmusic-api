import routes from './routes.js';
import AlbumsHandler from './handler.js';

const albums = {
  name: 'albums',
  version: '1.0.0',
  register: (server, { service }) => {
    const handler = new AlbumsHandler(service);
    server.route(routes(handler));
  },
};

export default albums;
