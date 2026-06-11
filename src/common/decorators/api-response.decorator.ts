import { SetMetadata, applyDecorators } from '@nestjs/common';
import { ResponseOptions } from '../interfaces/api-response.interface';

export const RESPONSE_METADATA = 'custom-response-metadata';

export function CommonApiResponse(options: ResponseOptions = {}) {
  const { message = 'Success', status = 200, isPaginated = false } = options;
  return applyDecorators(
    SetMetadata(RESPONSE_METADATA, { message, status, isPaginated }),
  );
}

export function GetResponse(message?: string) {
  return CommonApiResponse({
    message: message || 'Recurso obtenido exitosamente',
    status: 200,
  });
}

export function PostResponse(message?: string) {
  return CommonApiResponse({
    message: message || 'Recurso creado exitosamente',
    status: 201,
  });
}

export function PutResponse(message?: string) {
  return CommonApiResponse({
    message: message || 'Recurso actualizado exitosamente',
    status: 200,
  });
}

export function PatchResponse(message?: string) {
  return CommonApiResponse({
    message: message || 'Recurso actualizado parcialmente exitosamente',
    status: 200,
  });
}

export function DeleteResponse(message?: string) {
  return CommonApiResponse({
    message: message || 'Recurso eliminado exitosamente',
    status: 200,
  });
}

export function PaginatedResponse(message?: string) {
  return CommonApiResponse({
    message: message || 'Datos paginados obtenidos exitosamente',
    status: 200,
    isPaginated: true,
  });
}
