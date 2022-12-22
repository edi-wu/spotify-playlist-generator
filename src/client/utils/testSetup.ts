/**
 * @jest-environment jsdom
 */

import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';

const setup = (jsx: JSX.Element, options: { withUser: boolean } = { withUser: false }) => {
  if (options.withUser) {
    return { user: userEvent.setup(), ...render(jsx, { wrapper: BrowserRouter }) };
  }
  return { user: null, ...render(jsx, { wrapper: BrowserRouter }) };
};

export default setup;
