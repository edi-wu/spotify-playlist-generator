import React from 'react';
import { AlertProps } from '../types';

const Alert = ({ className, message }: AlertProps): JSX.Element => (
  <div className={className} data-testid="alertMessage">
    {message}
  </div>
);
export default Alert;
