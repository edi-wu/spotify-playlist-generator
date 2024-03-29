import React from 'react';
import styled from 'styled-components';
import { InputProps } from '../types';

const Label = styled.label`
  display: flex;
`;

const InputField = styled.input`
  font-size: max(16px, 2vw);
  margin-left: 10px;
  flex: 1;
  border-top-style: hidden;
  border-right-style: hidden;
  border-left-style: hidden;
  &:focus {
    outline: none;
  }
`;

const LabelText = styled.span`
  font-weight: 300;
  font-size: max(16px, 2vw);
`;

const TextInput = ({
  className,
  label,
  name,
  value,
  changeHandler,
  fieldBeforeLabel = false,
}: InputProps): JSX.Element => (
  <Label htmlFor={name}>
    {fieldBeforeLabel ? null : <LabelText>{`${label}: `}</LabelText>}
    <InputField
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
export default TextInput;
