import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { Prisma } from '@prisma/client';

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaClientExceptionFilter extends BaseExceptionFilter {
  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    console.log('Code is: ',exception.code);
    console.error(exception.message);
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const message = exception.name + ' : '+exception.message.replace(/\n/g, '');
    

    switch (exception.code) {
      case 'P2002':
        var status = HttpStatus.CONFLICT;
        response.status(status).json({
          statusCode: status,
          message: message 
        });
      break;

      case 'P2025':
        status = HttpStatus.NOT_FOUND
        response.status(status).json({
          statusCode: status,
          message: 'item not found: ' + message
        });
      break;
    
      default:
        // default 500 error code
        super.catch(exception, host); 
        break;
    }

    
  }
}
