import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  // generate token
  generateToken(params: { id: number; username: string }): string {
    const { username, id } = params;
    return this.jwtService.sign(
      { username, id },
      { secret: process.env.SECRET_KEY, expiresIn: 86400 }, // expires in 24 hrs
    );
  }

  // verify token
  async verifyToken(token: string) {
    return this.jwtService.verifyAsync(token, {
      secret: process.env.SECRET_KEY,
    });
  }
}
