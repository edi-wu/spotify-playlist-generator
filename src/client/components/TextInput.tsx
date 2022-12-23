import React from 'react';
import { InputProps } from '../types';

const TextInput = ({
  className,
  label,
  name,
  value,
  changeHandler,
  fieldBeforeLabel = false,
}: InputProps) => (
  <label htmlFor={name}>
    {fieldBeforeLabel ? null : label}
    <input
      className={className}
      type="text"
      name={name}
      id={name}
      value={value}
      onChange={changeHandler}
    />
    {fieldBeforeLabel ? label : null}
  </label>
);
export default TextInput;
