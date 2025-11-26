import pkg from 'pg';
import ClientError from '../../exceptions/ClientError.js';

const { Pool } = pkg;

class AuthenticationsService {
  constructor() {
    this._pool = new Pool();
  }

  async addRefreshToken(token) {
    const query = {
      text: 'INSERT INTO authentications (token) VALUES ($1)',
      values: [token],
    };

    await this._pool.query(query);
  }

  async verifyRefreshToken(token) {
    const query = {
      text: 'SELECT token FROM authentications WHERE token = $1',
      values: [token],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      // untuk kasus "Refresh Authentication with Invalid Token" → 400
      throw new ClientError('Refresh token tidak valid', 400);
    }
  }

  async deleteRefreshToken(token) {
    const query = {
      text: 'DELETE FROM authentications WHERE token = $1 RETURNING token',
      values: [token],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      // untuk delete dengan token yang salah → 400
      throw new ClientError('Refresh token tidak ditemukan', 400);
    }
  }
}

export default AuthenticationsService;
