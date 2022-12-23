import React from 'react';
import { createHashRouter, RouterProvider } from 'react-router-dom';
import Homepage from './routes/Homepage';
import OAuthRedirect from './routes/OAuthRedirect';
import FormPage from './routes/FormPage';
import WebPlayerPage from './routes/WebPlayerPage';
import ErrorPage from './routes/ErrorPage';
import { RoutesConfig } from './types';

// TODO: flesh out errorElement route to handle thrown errors
export const routesConfig: RoutesConfig = [
  {
    path: '/',
    element: <Homepage />,
  },
  { path: '/oauth', element: <OAuthRedirect /> },
  { path: '/form', element: <FormPage /> },
  { path: '/player', element: <WebPlayerPage /> },
  { path: '/error', element: <ErrorPage /> },
];

const router = createHashRouter(routesConfig);

const App = () => <RouterProvider router={router} />;

export default App;
