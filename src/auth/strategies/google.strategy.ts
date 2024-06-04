import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Profile, Strategy } from "passport-google-oauth20";
import { AuthService } from "../auth.service";
@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy) {
    constructor(private authService: AuthService) {
        super({
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: 'http://localhost:3000/auth/oauth-login',
            scope: ['profile', 'email'],
        });
    }
    async validate(accessToken: string, refreshToken: string, profile: Profile) {
        console.log('access token is:', accessToken)
        console.log('refresh token is:', refreshToken)
        console.log('profile is:', profile)
        console.log('...profile ends here...')

        const { id, emails, name } = profile;
        const email = emails[0].value;
        const givenName = name.givenName;
        const familyName = name.familyName;

        const user = await this.authService.validateGoogleUser({
            id,
            email,
            name: { givenName, familyName }
        });
        if (!user) {
            throw new UnauthorizedException('Email is not registered');
        }
    console.log('the user in google strategy(sign in through google) file is: ',user)
        return user;
    }


}