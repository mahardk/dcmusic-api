import ValidationError from '../../exceptions/ValidationError.js';
import { SongPayloadSchema } from './schema.js';

const SongsValidator = {
  validateSongPayload: (payload) => {
    const { error } = SongPayloadSchema.validate(payload);
    if (error) {
      throw new ValidationError(error.message);
    }
  },
};

export default SongsValidator;
