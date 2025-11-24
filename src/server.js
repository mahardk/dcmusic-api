import Hapi from '@hapi/hapi';
import dotenv from 'dotenv';

import albums from './api/albums/index.js';
import songs from './api/songs/index.js';

import AlbumService from './services/postgres/AlbumService.js';
import SongService from './services/postgres/SongService.js';
import ClientError from './exceptions/ClientError.js'; 

dotenv.config();

const init = async () => {
  const albumService = new AlbumService();
  const songService = new SongService();

  const server = Hapi.server({
    port: process.env.PORT || 5000,
    host: process.env.HOST || 'localhost',
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  server.ext('onPreResponse', (request, h) => {
    const { response } = request;

    if (response instanceof ClientError) {
      const newResponse = h.response({
        status: 'fail',
        message: response.message,
      });
      newResponse.code(response.statusCode);
      return newResponse;
    }

    if (!response.isBoom) {
      return h.continue;
    }

    const statusCode = response.output.statusCode;

    if (statusCode === 404) {
      const newResponse = h.response({
        status: 'fail',
        message: 'Halaman tidak ditemukan',
      });
      newResponse.code(404);
      return newResponse;
    }

    const newResponse = h.response({
      status: 'error',
      message: 'Terjadi kegagalan pada server kami.',
    });
    newResponse.code(500);
    return newResponse;
  });

  await server.register([
    {
      plugin: albums,
      options: {
        service: albumService,
      },
    },
    {
      plugin: songs,
      options: {
        service: songService,
      },
    },
  ]);

  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
};

init();
