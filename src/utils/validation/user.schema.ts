import * as Joi from 'joi';

export const UserSchema = Joi.object({
  username: Joi.string().alphanum().min(5).max(20).trim().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

export const LoginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});
