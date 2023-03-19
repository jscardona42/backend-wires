import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import * as CryptoJS from 'crypto-js';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const query = context.getHandler().name;

    if (
      query === 'signInUser' ||
      query === 'logOutUser' ||
      query == 'createUser'
    ) {
      return true;
    }

    if (request.headers.authorization != undefined) {
      let authorization = request.headers.authorization;
      try {
        authorization = CryptoJS.AES.decrypt(
          authorization,
          process.env.KEY_CRYPTO,
        ).toString(CryptoJS.enc.Utf8);

        jwt.verify(authorization, process.env.JWT_SECRET);
        return true;
      } catch (error) {
        throw new UnauthorizedException(`Usuario no autorizado`);
      }
    }

    throw new UnauthorizedException(`No autorizado`);
  }
}
