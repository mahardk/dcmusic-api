import pkg from 'pg';
import { nanoid } from 'nanoid';

const { Pool } = pkg;

class SongService {
  constructor() {
    this._pool = new Pool({
      host: process.env.PGHOST,
      port: process.env.PGPORT,
      database: process.env.PGDATABASE,
      user: process.env.PGUSER,
      password: process.env.PGPASSWORD,
    });
  }

  async addSong({ title, year, genre, performer, duration, albumId }) {
    const id = `song-${nanoid(10)}`;

    const query = {
      text: `
        INSERT INTO songs (id, title, year, genre, performer, duration, album_id)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING id
      `,
      values: [
        id,
        title,
        year,
        genre,
        performer,
        duration ?? null,
        albumId ?? null,
      ],
    };

    const result = await this._pool.query(query);
    return result.rows[0].id;
  }

  // OPSIONAL 2: filter by title & performer
  async getSongs({ title, performer } = {}) {
    const conditions = [];
    const values = [];
    let index = 1;

    if (title) {
      conditions.push(`title ILIKE $${index}`);
      values.push(`%${title}%`);
      index += 1;
    }

    if (performer) {
      conditions.push(`performer ILIKE $${index}`);
      values.push(`%${performer}%`);
      index += 1;
    }

    let text = 'SELECT id, title, performer FROM songs';

    if (conditions.length > 0) {
      text += ' WHERE ' + conditions.join(' AND ');
    }

    const query = { text, values };

    const result = await this._pool.query(query);
    return result.rows;
  }

  async getSongById(id) {
    const query = {
      text: `
        SELECT
          id,
          title,
          year,
          performer,
          genre,
          duration,
          album_id AS "albumId"
        FROM songs
        WHERE id = $1
      `,
      values: [id],
    };

    const result = await this._pool.query(query);
    if (!result.rowCount) return null;

    return result.rows[0];
  }

  async editSongById(id, { title, year, genre, performer, duration, albumId }) {
    const query = {
      text: `
        UPDATE songs
        SET title = $1,
            year = $2,
            genre = $3,
            performer = $4,
            duration = $5,
            album_id = $6
        WHERE id = $7
        RETURNING id
      `,
      values: [
        title,
        year,
        genre,
        performer,
        duration ?? null,
        albumId ?? null,
        id,
      ],
    };

    const result = await this._pool.query(query);
    return result.rowCount > 0;
  }

  async deleteSongById(id) {
    const query = {
      text: 'DELETE FROM songs WHERE id = $1 RETURNING id',
      values: [id],
    };

    const result = await this._pool.query(query);
    return result.rowCount > 0;
  }
}

export default SongService;
