import Joi from 'joi';

export const createUserSchema = Joi.object({
  userName: Joi.string().min(3).max(30).required().messages({
    'string.empty': 'Username is required',
    'string.min': 'Username should be at least 3 characters',
    'string.max': 'Username should be at most 30 characters',
  }),

  password: Joi.string().min(6).required().messages({
    'string.empty': 'Password is required',
    'string.min': 'Password should be at least 6 characters',
  }),
});

export const updateUserSchema = Joi.object({
  userName: Joi.string().min(3).max(30).messages({
    'string.min': 'Username should be at least 3 characters',
    'string.max': 'Username should be at most 30 characters',
  }),

  password: Joi.string().min(6).messages({
    'string.min': 'Password should be at least 6 characters',
  }),
})
  .min(1)
  .messages({
    'object.min': 'At least one field (userName or password) must be provided',
  });
