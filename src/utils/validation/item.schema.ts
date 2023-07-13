import * as Joi from 'joi';

export const ItemSchema = Joi.object({
  title: Joi.string().trim().min(5).max(50).required(),
  description: Joi.string().min(5).max(250),
  userId: Joi.number().required(),
});

export const EditItemSchema = Joi.object({
  title: Joi.string().trim().min(5).max(50),
  description: Joi.string().min(5).max(250),
  completed: Joi.boolean(),
  userId: Joi.number().required(),
  id: Joi.number().required(),
});

export const GetByIdSchema = Joi.object({
  userId: Joi.number().required(),
  id: Joi.number().required(),
});

export const GetItemsSchema = Joi.object({
  limit: Joi.number().default(10),
  page: Joi.number().integer().min(1).default(1),
  userId: Joi.number().required(),
});

export const SearchItemSchema = Joi.object({
  title: Joi.string().trim(),
  description: Joi.string().trim(),
  completed: Joi.boolean(),
  userId: Joi.number().required(),
});
