import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { prisma } from './db';

passport.use(
    new GoogleStrategy(
        {   
            clientID: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
            callbackURL: '/auth/google/callback',
        },
        async (accessToken:string , refreshToken: string , profile: any, done: Function) => {
            try {
                const email = profile.emails?.[0].value;
                if (!email) {
                    return done(new Error('No email found in Google profile'));
                }

                let stall = await prisma.stalls.findUnique({ where: { email_id: email } });

                if (!stall) {
                    stall = await prisma.stalls.create({
                        data: {
                            email_id: email,    
                            name: profile.displayName || 'Unnamed Stall',
                            organisations: 'Startup',
                            about: ' ',
                            google_oauth: 'google_oauth_placeholder', // Placeholder password for Google-authenticated users
                        },
                    });
                }

                return done(null, stall);
            } catch (err) {
                return done(err as Error);
            }
        }
    )
);

passport.serializeUser((user: any, done: Function) => {
    done(null, user.stall_id);
});

passport.deserializeUser(async (id: string, done: Function) => {
    try {
        const stall = await prisma.stalls.findUnique({ where: { stall_id: id } });
        done(null, stall);
    } catch (err) {
        done(err as Error, null);
    }
});
