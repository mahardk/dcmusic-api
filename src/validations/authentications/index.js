import ValidationError from '../../exceptions/ValidationError.js';
import {
  LoginPayloadSchema,
  TokenPayloadSchema,
} from './schema.js';

const AuthenticationsValidator = {
  validateLoginPayload: (payload) => {
    const { error } = LoginPayloadSchema.validate(payload);
    if (error) throw new ValidationError(error.message);
  },

  validateTokenPayload: (payload) => {
    const { error } = TokenPayloadSchema.validate(payload);
    if (error) throw new ValidationError(error.message);
  },
};

export default AuthenticationsValidator;
