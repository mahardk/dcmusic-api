import ValidationError from '../../exceptions/ValidationError.js';
import {
  PlaylistPayloadSchema,
  PlaylistSongPayloadSchema,
} from './schema.js';

const PlaylistsValidator = {
  validatePlaylistPayload: (payload) => {
    const { error } = PlaylistPayloadSchema.validate(payload);
    if (error) {
      throw new ValidationError(error.message);
    }
  },

  validatePlaylistSongPayload: (payload) => {
    const { error } = PlaylistSongPayloadSchema.validate(payload);
    if (error) {
      throw new ValidationError(error.message);
    }
  },
};

export default PlaylistsValidator;
