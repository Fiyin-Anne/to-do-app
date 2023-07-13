import { BadRequestException, Injectable } from '@nestjs/common';
import Joi from 'joi';

@Injectable()
export class Validator {
  validate(schema: Joi.ObjectSchema<any>, data: object) {
    const { error, value } = schema
      .options({
        abortEarly: false,
        errors: {
          wrap: {
            label: false,
          },
        },
      })
      .validate(data);

    if (error) {
      const errorMessages = error.details
        .map((detail) => detail.message)
        .join();
      throw new BadRequestException(errorMessages);
    }

    return value;
  }
}
