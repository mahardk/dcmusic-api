import autoBind from 'auto-bind';
import AlbumsValidator from '../../validations/albums/index.js';

class AlbumsHandler {
  constructor(service) {
    this._service = service;
    autoBind(this);
  }

  // POST /albums
  async postAlbumHandler(request, h) {
    AlbumsValidator.validateAlbumPayload(request.payload);

    const { name, year } = request.payload;
    const albumId = await this._service.addAlbum({ name, year });

    return h
      .response({
        status: 'success',
        data: { albumId },
      })
      .code(201);
  }

  // GET /albums/{id}
  async getAlbumByIdHandler(request, h) {
    const { id } = request.params;

    const album = await this._service.getAlbumById(id);

    if (!album) {
      return h
        .response({
          status: 'fail',
          message: 'Album tidak ditemukan',
        })
        .code(404);
    }

    return {
      status: 'success',
      data: { album },
    };
  }

  // PUT /albums/{id}
  async putAlbumByIdHandler(request, h) {
    const { id } = request.params;

    AlbumsValidator.validateAlbumPayload(request.payload);

    const { name, year } = request.payload;
    const success = await this._service.editAlbumById(id, { name, year });

    if (!success) {
      return h
        .response({
          status: 'fail',
          message: 'Gagal memperbarui album. Id tidak ditemukan',
        })
        .code(404);
    }

    return {
      status: 'success',
      message: 'Album berhasil diperbarui',
    };
  }

  // DELETE /albums/{id}
  async deleteAlbumByIdHandler(request, h) {
    const { id } = request.params;

    const success = await this._service.deleteAlbumById(id);

    if (!success) {
      return h
        .response({
          status: 'fail',
          message: 'Album gagal dihapus. Id tidak ditemukan',
        })
        .code(404);
    }

    return {
      status: 'success',
      message: 'Album berhasil dihapus',
    };
  }
}

export default AlbumsHandler;
