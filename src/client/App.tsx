import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Homepage from './routes/Homepage';
import OAuthRedirect from './routes/OAuthRedirect';
import FormPage from './routes/FormPage';
import WebPlayerPage from './routes/WebPlayerPage';
import { RoutesConfig } from './types';

export const routesConfig: RoutesConfig = [
  {
    path: '/',
    element: <Homepage />,
  },
  { path: '/oauth', element: <OAuthRedirect /> },
  { path: '/form', element: <FormPage /> },
  { path: '/player', element: <WebPlayerPage /> },
];

const router = createBrowserRouter(routesConfig);

const App = () => <RouterProvider router={router} />;

export default App;
