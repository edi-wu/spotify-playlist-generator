import React from 'react';
import styled from 'styled-components';
import { InputProps } from '../types';

const Label = styled.label`
  display: flex;
`;

const ShortInputField = styled.input`
  font-size: max(16px, 2vw);
  margin-left: 10px;
  margin-right: 5px;
  width: max(30px, 3vw);
  border-top-style: hidden;
  border-right-style: hidden;
  border-left-style: hidden;
  &:focus {
    outline: none;
  }
  text-align: right;
`;

const LabelText = styled.span`
  font-weight: 300;
  font-size: max(16px, 2vw);
`;

const ShortTextInput = ({
  className,
  label,
  name,
  value,
  changeHandler,
  fieldBeforeLabel = false,
}: InputProps): JSX.Element => (
  <Label htmlFor={name}>
    {fieldBeforeLabel ? null : <LabelText>{`${label}: `}</LabelText>}
    <ShortInputField
      className={className}
      type="text"
      name={name}
      id={name}
      value={value}
      onChange={changeHandler}
    />
    {fieldBeforeLabel ? <LabelText>{` ${label}`}</LabelText> : null}
  </Label>
);
export default ShortTextInput;
