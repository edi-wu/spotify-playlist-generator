import express, { Router } from 'express';
import oauthController from '../controllers/oauthController';
import playlistController from '../controllers/playlistController';
import { setCookies, returnSuccessResponse } from '../utils/middleware';

const apiRouter: Router = express.Router();

// Route to redirect to oauth
apiRouter.get('/login', oauthController.generateRedirectUrl, setCookies, oauthController.redirect);

// Route to obtain access token and set on cookie
apiRouter.get(
  '/getToken',
  oauthController.validateOAuth,
  oauthController.generateToken,
  setCookies,
  oauthController.redirect
);

// Route to refresh access token
apiRouter.get(
  '/refreshToken',
  oauthController.validateToken,
  oauthController.refreshToken,
  setCookies,
  returnSuccessResponse
);

// Route to generate playlist and return playlist ID
apiRouter.post(
  '/generatePlaylist',
  oauthController.validateToken,
  playlistController.createPlaylist,
  playlistController.getRecommendations,
  playlistController.addTracks,
  playlistController.returnPlaylist
);

export default apiRouter;
