import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthService } from './auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = GqlExecutionContext.create(context);
    const { req } = ctx.getContext();

    // fetch token from request header
    const token = this.getRequestToken(req.headers);

    if (!token) {
      throw new UnauthorizedException('Unauthorized access.');
    }

    try {
      const payload = await this.authService.verifyToken(token);

      req['user'] = payload;
      return true;
    } catch {
      throw new UnauthorizedException('Unauthorized access.');
    }
  }

  private getRequestToken(reqHeaders): string | undefined {
    // check request header for authorization token
    const [type, token] = reqHeaders.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
