import * as Joi from '@hapi/joi';

export const configValidationSchema = Joi.object({
  PORT: Joi.number().default(3000),
  AMQP_URI: Joi.string().required(),
  QUEUE_NAME: Joi.string().default('default-queue'),
  NUM_AVAILABLE_WORKER: Joi.number().required(),
});
