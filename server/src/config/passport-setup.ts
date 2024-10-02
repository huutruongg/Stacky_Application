import { IUser } from './../types/IUser.d';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as GitHubStrategy } from 'passport-github';
import axios from 'axios';
import { log } from 'console';
import CandidateService from '../modules/Candidate/candidate.service';
import AuthService from '../modules/Auth/auth.service'
import Provider from '../types/EnumProvider';


const handleUserOAuth = async (provider: string, providerId: string, email: string, displayName: string, accessToken: string) => {
  const user: IUser | null = await AuthService.getUserByEmail(email);
  log(user)
  if (user) {
    await CandidateService.updateOauth(provider, providerId, accessToken, String(user._id));
    return user;
  } else {
    const newUser: IUser | null = await AuthService.createCandidateUser(email, displayName);
    // log(newUser)
    if (!newUser) {
      return;
    }
    await CandidateService.updateOauth(provider, providerId, accessToken, newUser._id as string);
    return newUser;
  }
};

// Configure Google Strategy
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID as string,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
  callbackURL: '/auth/google/callback',
  scope: ['profile', 'email']
}, async (accessToken: string, refreshToken: string, profile: any, done: Function) => {
  const email = profile.emails[0].value;
  const provider = Provider.GOOGLE;
  const providerId = profile.id;
  log(email, provider, providerId)
  try {
    const user = await handleUserOAuth(provider, providerId, email, profile.displayName, accessToken);
    log(user);
    done(null, user);
  } catch (err) {
    done(err);
  }
}));

// Configure GitHub Strategy
passport.use(new GitHubStrategy({
  clientID: process.env.GITHUB_CLIENT_ID as string,
  clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
  callbackURL: '/auth/github/callback',
  scope: ['user:email', 'repo']
}, async (accessToken: string, refreshToken: string, profile: any, done: Function) => {
  let email: string | null = null;
  const provider = Provider.GITHUB;
  const providerId = profile.id;

  if (profile.emails && profile.emails[0]) {
    email = profile.emails[0].value;
  } else {
    try {
      const response = await axios.get('https://api.github.com/user/emails', {
        headers: { Authorization: `token ${accessToken}` }
      });
      const emails = response.data;
      const primaryEmail = emails.find((e: any) => e.primary) || emails[0];
      email = primaryEmail ? primaryEmail.email : null;
    } catch (err) {
      return done(err);
    }
  }

  if (!email) {
    return done(new Error('Cannot retrieve email from GitHub account'));
  }

  try {
    const user = await handleUserOAuth(provider, providerId, email, profile.displayName, accessToken);
    done(null, user);
  } catch (err) {
    done(err);
  }
}));

passport.serializeUser((user: any, done: Function) => {
  done(null, user._id);
});

passport.deserializeUser(async (id: string, done: Function) => {
  try {
    const user = await AuthService.getUserById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});
