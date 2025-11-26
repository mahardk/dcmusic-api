import pkg from 'pg';
import { nanoid } from 'nanoid';
import ClientError from '../../exceptions/ClientError.js';

const { Pool } = pkg;

class CollaborationsService {
  constructor() {
    this._pool = new Pool();
  }

  async _verifyUserExists(userId) {
    const query = {
      text: 'SELECT id FROM users WHERE id = $1',
      values: [userId],
    };
    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new ClientError('User tidak ditemukan', 404);
    }
  }

  async _verifyPlaylistExists(playlistId) {
    const query = {
      text: 'SELECT id FROM playlists WHERE id = $1',
      values: [playlistId],
    };
    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new ClientError('Playlist tidak ditemukan', 404);
    }
  }

  async addCollaboration({ playlistId, userId }) {
    // pastikan playlist & user valid → jika tidak, lempar 404 (bukan 500 FK error)
    await this._verifyPlaylistExists(playlistId);
    await this._verifyUserExists(userId);

    const id = `collab-${nanoid(16)}`;

    const query = {
      text: 'INSERT INTO collaborations (id, playlist_id, user_id) VALUES ($1, $2, $3) RETURNING id',
      values: [id, playlistId, userId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new ClientError('Kolaborasi gagal ditambahkan', 400);
    }

    return result.rows[0].id;
  }

  async deleteCollaboration({ playlistId, userId }) {
    const query = {
      text: 'DELETE FROM collaborations WHERE playlist_id = $1 AND user_id = $2 RETURNING id',
      values: [playlistId, userId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new ClientError('Kolaborasi gagal dihapus', 400);
    }
  }

  async verifyCollaborator(playlistId, userId) {
    const query = {
      text: 'SELECT id FROM collaborations WHERE playlist_id = $1 AND user_id = $2',
      values: [playlistId, userId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new ClientError('Anda tidak berhak mengakses resource ini', 403);
    }
  }
}

export default CollaborationsService;
