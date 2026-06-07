import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from '../models/user.model.js';

passport.use(
    new GoogleStrategy(
        {
            clientID:process.env.GOOGLE_CLIENT_ID,
            clientSecret:process.env.GOOGLE_CLIENT_SECRET,
            callbackURL:"http://localhost:3000/api/auth/google/callback"
        },
        async (accessToken,refreshToken,profile,done)=>{
            try{
                let user=await User.findOne({email:profile.emails[0].value,});
                if(!user){
                    user=await User.create({
                        googleId:profile.id,
                        userName:profile.displayName,
                        email:profile.emails[0].value,
                    });
                }
                done(null,user);
            }
            
            catch(error){
                done(error,null);
            }
        }
        
    )
);

export default passport;
// now go to server.js and
//  import passport from "./config/passport.js"
// app.use(passport.initialize());
// then go to routes/authRoutes.js

