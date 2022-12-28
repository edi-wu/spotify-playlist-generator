import React from 'react';
import { ButtonProps } from '../types';

const Button = ({ className, buttonText, clickHandler }: ButtonProps): JSX.Element => (
  <button className={className} type="button" onClick={clickHandler}>
    {buttonText}
  </button>
);
export default Button;
