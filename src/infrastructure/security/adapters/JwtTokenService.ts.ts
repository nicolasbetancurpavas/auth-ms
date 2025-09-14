import jwt, { Secret, SignOptions } from 'jsonwebtoken';
import { ENV } from '@modules/shared';
import { TokenService } from '@modules/Auth/domain/services/AuthDomainServices';

export default class JwtTokenService implements TokenService {
    sign(payload: object, opts?: { expiresIn?: string | number }): string {
        const secret: Secret = ENV.JWT_SECRET as Secret;
        const expiresIn: SignOptions['expiresIn'] = (opts?.expiresIn ??
            ENV.ACCESS_TOKEN_TTL) as SignOptions['expiresIn'];

        return jwt.sign(payload, secret, { expiresIn });
    }

    verify<T = unknown>(token: string): T {
        const secret: Secret = ENV.JWT_SECRET as Secret;
        return jwt.verify(token, secret) as T;
    }
}
