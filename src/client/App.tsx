import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Homepage from './routes/Homepage';
import OAuthPlaceholder from './routes/OAuthPlaceholder';
import FormPage from './routes/FormPage';
import WebPlayerPage from './routes/WebPlayerPage';

type RoutesConfig = {
  path: string;
  element: JSX.Element;
}[];

export const routesConfig: RoutesConfig = [
  {
    path: '/',
    element: <Homepage />,
  },
  { path: '/oauth', element: <OAuthPlaceholder /> },
  { path: '/form', element: <FormPage /> },
  { path: '/player', element: <WebPlayerPage /> },
];

const router = createBrowserRouter(routesConfig);

const App = () => <RouterProvider router={router} />;

export default App;
