import UsersHandler from './handler.js';
import routes from './routes.js';

export default {
  name: 'users',
  register: (server, { service, validator }) => {
    const handler = new UsersHandler(service, validator);
    server.route(routes(handler));
  },
};
