import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Homepage from './routes/Homepage';
import OAuthPlaceholder from './routes/OAuthPlaceholder';
import InputFormPage from './routes/InputFormPage';
import WebPlayerPage from './routes/WebPlayerPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Homepage />,
  },
  { path: '/oauth', element: <OAuthPlaceholder /> },
  { path: '/form', element: <InputFormPage /> },
  { path: '/player', element: <WebPlayerPage /> },
]);

const App = () => <RouterProvider router={router} />;

export default App;
