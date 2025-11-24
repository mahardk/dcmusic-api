import ValidationError from '../../exceptions/ValidationError.js';
import { AlbumPayloadSchema } from './schema.js';

const AlbumsValidator = {
  validateAlbumPayload: (payload) => {
    const { error } = AlbumPayloadSchema.validate(payload);
    if (error) {
      throw new ValidationError(error.message);
    }
  },
};

export default AlbumsValidator;
