import express, { Router } from 'express';
import oauthController from '../controllers/oauthController';
import { setCookies } from '../utils/middleware';

const apiRouter: Router = express.Router();

// Route to redirect to oauth
apiRouter.get('/login', oauthController.generateRedirectUrl, oauthController.redirect);

// Route to obtain access token and set on cookie
apiRouter.get(
  '/getToken/:state',
  oauthController.validateOAuth,
  oauthController.generateToken,
  setCookies,
  oauthController.redirect
);

export default apiRouter;
