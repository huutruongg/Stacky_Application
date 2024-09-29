import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as GitHubStrategy } from 'passport-github';
import axios from 'axios';
import { log } from 'console';
import CandidateService from '../modules/Candidate/candidate.service';
import Provider from '../types/IProvider';


const handleUserOAuth = async (provider: string, providerId: string, email: string, displayName: string, accessToken: string) => {
  const user = await CandidateService.getCandidateByEmail(email);
  if (user) {
    await CandidateService.updateOauth(provider, providerId, accessToken, user.candidate.candidateId);
    return user;
  } else {
    const newUser = await CandidateService.createCandidate(email, displayName);
    await CandidateService.updateOauth(provider, providerId, accessToken, newUser.candidate.candidateId);
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
  done(null, user.candidateId);
});

passport.deserializeUser(async (id: string, done: Function) => {
  try {
    const user = await CandidateService.getCandidateById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});
