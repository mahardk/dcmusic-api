import Joi from 'joi';

export const LoginPayloadSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required(),
});

export const TokenPayloadSchema = Joi.object({
  refreshToken: Joi.string().required(),
});
