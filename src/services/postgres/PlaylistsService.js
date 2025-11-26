import pkg from 'pg';
import { nanoid } from 'nanoid';
import ClientError from '../../exceptions/ClientError.js';

const { Pool } = pkg;

class PlaylistsService {
  constructor(collaborationsService) {
    this._pool = new Pool();
    this._collaborationsService = collaborationsService || null;
  }

  async addPlaylist({ name, owner }) {
    const id = `playlist-${nanoid(16)}`;

    const query = {
      text: 'INSERT INTO playlists (id, name, owner) VALUES ($1, $2, $3) RETURNING id',
      values: [id, name, owner],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new ClientError('Gagal menambahkan playlist', 400);
    }

    return result.rows[0].id;
  }

  async getPlaylists(userId) {
    const query = {
      text: `
        SELECT DISTINCT p.id, p.name, u.username
        FROM playlists p
        JOIN users u ON p.owner = u.id
        LEFT JOIN collaborations c ON c.playlist_id = p.id
        WHERE p.owner = $1 OR c.user_id = $1
      `,
      values: [userId],
    };

    const result = await this._pool.query(query);
    return result.rows;
  }

  async deletePlaylistById(id) {
    const query = {
      text: 'DELETE FROM playlists WHERE id = $1 RETURNING id',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new ClientError('Playlist tidak ditemukan', 404);
    }
  }

  async verifyPlaylistOwner(id, owner) {
    const query = {
      text: 'SELECT owner FROM playlists WHERE id = $1',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new ClientError('Playlist tidak ditemukan', 404);
    }

    const playlist = result.rows[0];

    if (playlist.owner !== owner) {
      throw new ClientError('Anda tidak berhak mengakses resource ini', 403);
    }
  }

  async verifyPlaylistAccess(id, userId) {
    const query = {
      text: 'SELECT owner FROM playlists WHERE id = $1',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new ClientError('Playlist tidak ditemukan', 404);
    }

    const playlist = result.rows[0];

    // jika owner, langsung boleh
    if (playlist.owner === userId) return;

    // jika bukan owner, cek collaborator
    if (this._collaborationsService) {
      await this._collaborationsService.verifyCollaborator(id, userId);
      return;
    }

    const collabQuery = {
      text: 'SELECT id FROM collaborations WHERE playlist_id = $1 AND user_id = $2',
      values: [id, userId],
    };

    const collabResult = await this._pool.query(collabQuery);

    if (!collabResult.rowCount) {
      throw new ClientError('Anda tidak berhak mengakses resource ini', 403);
    }
  }

  async _verifySongExists(songId) {
    const query = {
      text: 'SELECT id FROM songs WHERE id = $1',
      values: [songId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new ClientError('Lagu tidak ditemukan', 404);
    }
  }

  async addSongToPlaylist(playlistId, songId) {
    await this._verifySongExists(songId);

    const id = `playlist-song-${nanoid(16)}`;

    const query = {
      text: `
        INSERT INTO playlist_songs (id, playlist_id, song_id)
        VALUES ($1, $2, $3)
      `,
      values: [id, playlistId, songId],
    };

    await this._pool.query(query);
  }

  async getPlaylistWithSongs(playlistId) {
    const playlistQuery = {
      text: `
        SELECT p.id, p.name, u.username
        FROM playlists p
        JOIN users u ON p.owner = u.id
        WHERE p.id = $1
      `,
      values: [playlistId],
    };

    const playlistResult = await this._pool.query(playlistQuery);

    if (!playlistResult.rowCount) {
      throw new ClientError('Playlist tidak ditemukan', 404);
    }

    const playlist = playlistResult.rows[0];

    const songsQuery = {
      text: `
        SELECT s.id, s.title, s.performer
        FROM playlist_songs ps
        JOIN songs s ON ps.song_id = s.id
        WHERE ps.playlist_id = $1
      `,
      values: [playlistId],
    };

    const songsResult = await this._pool.query(songsQuery);

    return {
      ...playlist,
      songs: songsResult.rows,
    };
  }

  async deleteSongFromPlaylist(playlistId, songId) {
    const query = {
      text: `
        DELETE FROM playlist_songs
        WHERE playlist_id = $1 AND song_id = $2
        RETURNING id
      `,
      values: [playlistId, songId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new ClientError('Lagu gagal dihapus dari playlist. Id tidak ditemukan', 404);
    }
  }

  // ----- ACTIVITIES -----
  async addPlaylistActivity({ playlistId, songId, userId, action }) {
    const id = `activity-${nanoid(16)}`;

    const query = {
      text: `
        INSERT INTO playlist_song_activities (id, playlist_id, song_id, user_id, action)
        VALUES ($1, $2, $3, $4, $5)
      `,
      values: [id, playlistId, songId, userId, action],
    };

    await this._pool.query(query);
  }

  async getPlaylistActivities(playlistId) {
    const query = {
      text: `
        SELECT u.username, s.title, a.action, a.time
        FROM playlist_song_activities a
        JOIN users u ON a.user_id = u.id
        JOIN songs s ON a.song_id = s.id
        WHERE a.playlist_id = $1
        ORDER BY a.time ASC
      `,
      values: [playlistId],
    };

    const result = await this._pool.query(query);

    return {
      playlistId,
      activities: result.rows,
    };
  }
}

export default PlaylistsService;
