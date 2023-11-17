import { ValidationOptions, ValidateBy, buildMessage } from 'class-validator';
import { validate } from 'uuid';

export const IS_UUID_ARRAY = 'isUuidArray';

export function IsUuidArray(validationOptions?: ValidationOptions) {
  return ValidateBy(
    {
      name: IS_UUID_ARRAY,
      validator: {
        validate(value) {
          if (!Array.isArray(value)) {
            return false;
          }

          for (const element of value) {
            if (!validate(element)) {
              return false;
            }
          }

          return true;
        },
        defaultMessage: buildMessage(
          (eachPrefix) => `${eachPrefix} must be an array of valid UUIDs`,
          validationOptions,
        ),
      },
    },
    validationOptions,
  );
}
