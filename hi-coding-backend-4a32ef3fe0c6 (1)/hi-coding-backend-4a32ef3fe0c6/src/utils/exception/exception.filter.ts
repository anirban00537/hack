import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';

@Catch()
export class CustomExceptionFilter extends BaseExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse();
    const status = exception.getStatus ? exception.getStatus() : 500;

    const errors = [];
    if (exception.response && exception.response.errors) {
      for (const error of exception.response.errors) {
        errors.push({ message: error });
      }
    } else if (
      exception.response &&
      exception.response.message &&
      typeof exception.response.message !== 'string'
    ) {
      for (const error of exception.response.message) {
        errors.push({ message: error });
      }
    } else if (typeof exception.message === 'string') {
      errors.push({ message: exception.message });
    } else {
      errors.push({ message: 'Internal server error' });
    }

    return response.status(status).json({
      errors,
      success: false,
      status,
    });
  }
}
