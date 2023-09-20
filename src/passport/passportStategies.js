import passport from "passport"
import  {usersModel} from '../db/models/users.model.js'
import {Strategy as LocalStrategy} from 'passport-local'
import {Strategy as GithubStrategy} from 'passport-github2'
import { compareData } from "../utils.js"
import { usersManager } from "../managers/UsersMongo.js"


////////////////////////////////////////////////////////////////////////////

passport.use('login', new LocalStrategy(
    async function(username, password, done){
        try {
            const userInDB = await usersManager.findUser(username);
            if(!userInDB){
                return done(null, false);
            }
            const validPass = await compareData(password, userInDB.password);
            if(!validPass){
                return done(null, false);
            }
            return done(null, userInDB);
        } catch (error) {
            done(error);
        }
    }
));

passport.use(new GithubStrategy({
    clientID: "Iv1.9d0bc42e43b00afb",
    clientSecret: "940b34bb445e6a0245d10894d111fb3a941bd459",
    callbackURL: 'http://localhost:8080/api/users/github'
    },
    async function(accessToken, refreshToken, profile, done){
        try {
            const userInDB = await usersManager.findUser(profile._json.email);
            if(userInDB){
                if(userInDB.fromGithub){
                    return done(null, userInDB);
                } else{
                    return done(null, false);
                }
            }
            const newUser = {
                first_name: profile.displayName.split(' ')[0],
                last_name: profile.displayName.split(' ')[1],
                email: profile._json.email,
                age: 0,
                password: ' ',
                fromGithub: true
            }
            const userGithub = await usersManager.create(newUser);
            done(null, userGithub);
        } catch (error) {
            done(error);
        }
    }
));


passport.serializeUser((user,done) => {
    done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await usersModel.findById(id);
        done(null, user);
    } catch (error) {
        done(error);
    }
})