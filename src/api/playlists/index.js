import routes from './routes.js';
import PlaylistsHandler from './handler.js';

const playlists = {
  name: 'playlists',
  register: (server, { service, validator }) => {
    const handler = new PlaylistsHandler(service, validator);
    server.route(routes(handler));
  },
};

export default playlists;
