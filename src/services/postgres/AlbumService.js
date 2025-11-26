import pkg from 'pg';
import { nanoid } from 'nanoid';
import ClientError from '../../exceptions/ClientError.js';

const { Pool } = pkg;

class AlbumService {
  constructor() {
    this._pool = new Pool();
  }

  async addAlbum({ name, year }) {
    const id = `album-${nanoid(16)}`;

    const query = {
      text: 'INSERT INTO albums (id, name, year) VALUES ($1, $2, $3) RETURNING id',
      values: [id, name, year],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new ClientError('Gagal menambahkan album', 400);
    }

    return result.rows[0].id;
  }

  async getAlbumById(id) {
    const albumQuery = {
      text: 'SELECT id, name, year FROM albums WHERE id = $1',
      values: [id],
    };

    const albumResult = await this._pool.query(albumQuery);

    if (!albumResult.rowCount) {
      throw new ClientError('Album tidak ditemukan', 404);
    }

    const album = albumResult.rows[0];

    // opsional: sertakan daftar lagu di album
    const songsQuery = {
      text: 'SELECT id, title, performer FROM songs WHERE album_id = $1',
      values: [id],
    };

    const songsResult = await this._pool.query(songsQuery);

    return {
      ...album,
      songs: songsResult.rows,
    };
  }

  async editAlbumById(id, { name, year }) {
    const query = {
      text: 'UPDATE albums SET name = $1, year = $2 WHERE id = $3 RETURNING id',
      values: [name, year, id],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new ClientError('Gagal memperbarui album. Id tidak ditemukan', 404);
    }
  }

  async deleteAlbumById(id) {
    const query = {
      text: 'DELETE FROM albums WHERE id = $1 RETURNING id',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new ClientError('Album gagal dihapus. Id tidak ditemukan', 404);
    }
  }
}

export default AlbumService;
