import routes from './routes.js';
import AlbumsHandler from './handler.js';

const albums = {
  name: 'albums',
  register: (server, { service, validator }) => {
    const handler = new AlbumsHandler(service, validator);
    server.route(routes(handler));
  },
};

export default albums;
