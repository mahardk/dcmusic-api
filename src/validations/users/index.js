import ValidationError from '../../exceptions/ValidationError.js';
import { UserPayloadSchema } from './schema.js';

const UsersValidator = {
  validateUserPayload: (payload) => {
    const { error } = UserPayloadSchema.validate(payload);
    if (error) throw new ValidationError(error.message);
  },
};

export default UsersValidator;
