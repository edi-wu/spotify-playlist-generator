import React from 'react';
import { AlertProps } from '../types';

const Alert = ({ className, message }: AlertProps) => (
  <div className={className} data-testid="alertMessage">
    {message}
  </div>
);
export default Alert;
