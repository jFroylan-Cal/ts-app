import {
  CallHandler,
  ExecutionContext,
  HttpStatus,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Response } from 'express';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { RESPONSE_METADATA } from '../decorators/api-response.decorator';
import { ApiResponse } from '../interfaces/api-response.interface';

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<
  T,
  ApiResponse<T>
> {
  constructor(private reflector: Reflector) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ApiResponse<T>> {
    const httpContext = context.switchToHttp();
    const response = httpContext.getResponse<Response>();

    const metadata =
      this.reflector.get(RESPONSE_METADATA, context.getHandler()) || {};

    return next.handle().pipe(
      map((data) => {
        const statusCode =
          metadata.status || response.statusCode || HttpStatus.OK;
        const message = metadata.message || this.getDefaultMessage(statusCode);
        let responseData: ApiResponse<T>;
        responseData = {
          success: statusCode >= 200 && statusCode < 300,
          message,
          data: data,
          statusCode,
        };
        response.status(statusCode);

        return responseData;
      }),
    );
  }

  private getDefaultMessage(statusCode: number): string {
    const messages = {
      200: 'Operación exitosa',
      201: 'Recurso creado exitosamente',
      202: 'Solicitud aceptada',
      204: 'Sin contenido',
    };

    return messages[statusCode] || 'Operación completada';
  }
}
