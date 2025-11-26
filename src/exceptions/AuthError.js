import ClientError from './ClientError.js';

class AuthError extends ClientError {
  constructor(message) {
    super(message, 401);
    this.name = 'AuthError';
  }
}

export default AuthError;
