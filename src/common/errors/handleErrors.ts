import {
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';

export class HandleErrors {
  static handleError(error: any, message: string, logger?: any) {
    if (error.code === '23505') {
      throw new BadRequestException('Duplicated ' + message);
    }
    if (error.code === '23502') {
      throw new BadRequestException('Missing or invalid value');
    }

    if (error.code === '42P01') {
      throw new InternalServerErrorException('Fatal error');
    }

    if (error.code === '42P01') {
      throw new BadRequestException('Foreign key violation');
    }
    logger.error(error);
    throw new InternalServerErrorException(error);
  }
}
