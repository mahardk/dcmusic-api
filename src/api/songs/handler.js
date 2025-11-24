import autoBind from 'auto-bind';
import SongsValidator from '../../validations/songs/index.js';

class SongsHandler {
  constructor(service) {
    this._service = service;
    autoBind(this);
  }

  // POST /songs
  async postSongHandler(request, h) {
    SongsValidator.validateSongPayload(request.payload);

    const { title, year, genre, performer, duration, albumId } = request.payload;

    const songId = await this._service.addSong({
      title,
      year,
      genre,
      performer,
      duration,
      albumId,
    });

    return h
      .response({
        status: 'success',
        data: { songId },
      })
      .code(201);
  }

  // GET /songs
  async getSongsHandler(request) {
    const { title, performer } = request.query;

    const songs = await this._service.getSongs({
      title,
      performer,
    });

    return {
      status: 'success',
      data: { songs },
    };
  }

  // GET /songs/{id}
  async getSongByIdHandler(request, h) {
    const { id } = request.params;

    const song = await this._service.getSongById(id);

    if (!song) {
      return h
        .response({
          status: 'fail',
          message: 'Lagu tidak ditemukan',
        })
        .code(404);
    }

    return {
      status: 'success',
      data: { song },
    };
  }

  // PUT /songs/{id}
  async putSongByIdHandler(request, h) {
    const { id } = request.params;

    SongsValidator.validateSongPayload(request.payload);

    const { title, year, genre, performer, duration, albumId } = request.payload;

    const success = await this._service.editSongById(id, {
      title,
      year,
      genre,
      performer,
      duration,
      albumId,
    });

    if (!success) {
      return h
        .response({
          status: 'fail',
          message: 'Gagal memperbarui lagu. Id tidak ditemukan',
        })
        .code(404);
    }

    return {
      status: 'success',
      message: 'Lagu berhasil diperbarui',
    };
  }

  // DELETE /songs/{id}
  async deleteSongByIdHandler(request, h) {
    const { id } = request.params;

    const success = await this._service.deleteSongById(id);

    if (!success) {
      return h
        .response({
          status: 'fail',
          message: 'Lagu gagal dihapus. Id tidak ditemukan',
        })
        .code(404);
    }

    return {
      status: 'success',
      message: 'Lagu berhasil dihapus',
    };
  }
}

export default SongsHandler;
