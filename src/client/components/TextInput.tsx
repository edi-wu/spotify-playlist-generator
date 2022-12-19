import React from 'react';
import { InputProps } from '../types';

const TextInput = ({ className, label, name, value, changeHandler }: InputProps) => (
  <label htmlFor={name}>
    {label}
    <input
      className={className}
      type="text"
      name={name}
      id={name}
      value={value}
      onChange={changeHandler}
    />
  </label>
);
export default TextInput;
