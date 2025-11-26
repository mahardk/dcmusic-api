import pkg from 'pg';
import bcrypt from 'bcrypt';
import { nanoid } from 'nanoid';
import ClientError from '../../exceptions/ClientError.js';

const { Pool } = pkg;

class UsersService {
  constructor() {
    this._pool = new Pool();
  }

  async addUser({ username, password, fullname }) {
    // Pastikan username unik
    const checkQuery = {
      text: 'SELECT id FROM users WHERE username = $1',
      values: [username],
    };

    const checkResult = await this._pool.query(checkQuery);

    if (checkResult.rowCount > 0) {
      throw new ClientError(
        'Gagal menambahkan user. Username sudah digunakan',
        400,
      );
    }

    const id = `user-${nanoid(16)}`;
    const hashedPassword = await bcrypt.hash(password, 10);

    const query = {
      text: 'INSERT INTO users (id, username, password, fullname) VALUES ($1, $2, $3, $4) RETURNING id',
      values: [id, username, hashedPassword, fullname],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new ClientError('Gagal menambahkan user', 400);
    }

    return result.rows[0].id;
  }

  async verifyUserCredential(username, password) {
    const query = {
      text: 'SELECT id, password FROM users WHERE username = $1',
      values: [username],
    };

    const result = await this._pool.query(query);

    // username tidak ditemukan
    if (!result.rowCount) {
      throw new ClientError('Kredensial yang Anda berikan salah', 401);
    }

    const { id, password: hashedPassword } = result.rows[0];

    const isMatch = await bcrypt.compare(password, hashedPassword);

    if (!isMatch) {
      throw new ClientError('Kredensial yang Anda berikan salah', 401);
    }

    return id;
  }
}

export default UsersService;
