import React from 'react';
import styled from 'styled-components';
import { InputProps } from '../types';

const Label = styled.label`
  display: flex;
`;

const LabelText = styled.span`
  font-weight: 300;
  font-size: max(16px, 2vw);
`;

const Select = styled.select`
  margin-left: 10px;
  font-size: max(16px, 1.5vw);
`;

const DropDownMenu = ({
  className,
  label,
  defaultOptionLabel,
  name,
  value,
  changeHandler,
  menuOptions = [],
}: InputProps): JSX.Element => (
  <Label htmlFor={name}>
    <LabelText>{`${label}: `}</LabelText>
    <Select className={className} name={name} id={name} value={value} onChange={changeHandler}>
      <option value="">{defaultOptionLabel}</option>
      {menuOptions.map((option) => (
        <option value={option} key={option} data-testid="menuOption">
          {option}
        </option>
      ))}
    </Select>
  </Label>
);
export default DropDownMenu;
