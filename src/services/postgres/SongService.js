import pkg from 'pg';
import { nanoid } from 'nanoid';
import ClientError from '../../exceptions/ClientError.js';

const { Pool } = pkg;

class SongService {
  constructor() {
    this._pool = new Pool();
  }

  async addSong({
    title, year, genre, performer, duration, albumId,
  }) {
    const id = `song-${nanoid(16)}`;

    const query = {
      text: `
        INSERT INTO songs (id, title, year, genre, performer, duration, album_id)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING id
      `,
      values: [id, title, year, genre, performer, duration, albumId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new ClientError('Gagal menambahkan lagu', 400);
    }

    return result.rows[0].id;
  }

  async getSongs({ title, performer }) {
    const conditions = [];
    const values = [];

    if (title) {
      values.push(`%${title}%`);
      conditions.push(`LOWER(title) LIKE LOWER($${values.length})`);
    }

    if (performer) {
      values.push(`%${performer}%`);
      conditions.push(`LOWER(performer) LIKE LOWER($${values.length})`);
    }

    let queryText = 'SELECT id, title, performer FROM songs';

    if (conditions.length > 0) {
      queryText += ` WHERE ${conditions.join(' AND ')}`;
    }

    const query = {
      text: queryText,
      values,
    };

    const result = await this._pool.query(query);
    return result.rows;
  }

  async getSongById(id) {
    const query = {
      text: `
        SELECT id, title, year, performer, genre, duration, album_id AS "albumId"
        FROM songs
        WHERE id = $1
      `,
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new ClientError('Lagu tidak ditemukan', 404);
    }

    return result.rows[0];
  }

  async editSongById(id, {
    title, year, genre, performer, duration, albumId,
  }) {
    const query = {
      text: `
        UPDATE songs
        SET title = $1, year = $2, genre = $3, performer = $4, duration = $5, album_id = $6
        WHERE id = $7
        RETURNING id
      `,
      values: [title, year, genre, performer, duration, albumId, id],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new ClientError('Gagal memperbarui lagu. Id tidak ditemukan', 404);
    }
  }

  async deleteSongById(id) {
    const query = {
      text: 'DELETE FROM songs WHERE id = $1 RETURNING id',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new ClientError('Lagu gagal dihapus. Id tidak ditemukan', 404);
    }
  }
}

export default SongService;
