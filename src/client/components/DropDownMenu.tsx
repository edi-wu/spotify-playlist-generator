import React from 'react';
import { InputProps } from '../types';

const DropDownMenu = ({
  className,
  label,
  defaultOptionLabel,
  name,
  value,
  changeHandler,
  options = [],
}: InputProps) => (
  <label htmlFor={name}>
    {label}
    <select className={className} name={name} id={name} value={value} onChange={changeHandler}>
      <option value="">{defaultOptionLabel}</option>
      {options.map((option) => (
        <option value={option} key={option}>
          {option}
        </option>
      ))}
    </select>
  </label>
);
export default DropDownMenu;
