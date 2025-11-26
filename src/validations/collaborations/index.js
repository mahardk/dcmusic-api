import ValidationError from '../../exceptions/ValidationError.js';
import { CollaborationPayloadSchema } from './schema.js';

const CollaborationsValidator = {
  validateCollaborationPayload: (payload) => {
    const { error } = CollaborationPayloadSchema.validate(payload);
    if (error) throw new ValidationError(error.message);
  },
};

export default CollaborationsValidator;
