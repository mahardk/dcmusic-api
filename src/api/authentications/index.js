import AuthenticationsHandler from './handler.js';
import routes from './routes.js';

export default {
  name: 'authentications',
  register: (server, { authenticationsService, usersService, tokenManager, validator }) => {
    const handler = new AuthenticationsHandler(
      authenticationsService,
      usersService,
      tokenManager,
      validator,
    );

    server.route(routes(handler));
  },
};
