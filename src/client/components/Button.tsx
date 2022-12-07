import React from 'react';
import { ButtonProps } from '../types';

const Button = ({ className, buttonText, clickHandler }: ButtonProps) => (
  <button className={className} type="button" onClick={clickHandler}>
    {buttonText}
  </button>
);
export default Button;
