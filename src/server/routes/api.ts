import express, { Router } from 'express';
import oauthController from '../controllers/oauthController';

const apiRouter: Router = express.Router();

// TODO: route to redirect to oauth

apiRouter.get('/login', oauthController.generateRedirectUrl, oauthController.redirect);

// TODO: route to obtain access token and set on cookie

apiRouter.get('/getToken', (req, res) => {});

export default apiRouter;
