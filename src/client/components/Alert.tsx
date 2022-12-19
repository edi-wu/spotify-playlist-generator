import React from 'react';
import { AlertProps } from '../types';

const Alert = ({ className, message }: AlertProps) => <div className={className}>{message}</div>;
export default Alert;
