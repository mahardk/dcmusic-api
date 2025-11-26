import routes from './routes.js';
import CollaborationsHandler from './handler.js';

const collaborations = {
  name: 'collaborations',
  register: (server, { collaborationsService, playlistsService, validator }) => {
    const handler = new CollaborationsHandler(
      collaborationsService,
      playlistsService,
      validator,
    );

    server.route(routes(handler));
  },
};

export default collaborations;
