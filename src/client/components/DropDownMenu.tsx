import React from 'react';
import { InputProps } from '../types';

const DropDownMenu = ({
  className,
  label,
  defaultOptionLabel,
  name,
  value,
  changeHandler,
  menuOptions = [],
}: InputProps): JSX.Element => (
  <label htmlFor={name}>
    {label}
    <select className={className} name={name} id={name} value={value} onChange={changeHandler}>
      <option value="">{defaultOptionLabel}</option>
      {menuOptions.map((option) => (
        <option value={option} key={option} data-testid="menuOption">
          {option}
        </option>
      ))}
    </select>
  </label>
);
export default DropDownMenu;
