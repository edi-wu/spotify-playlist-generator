import React from 'react';
import styled from 'styled-components';
import { ButtonProps } from '../types';

const StyledButton = styled.button`
  background-color: #1db954;
  text-align: center;
  font-size: max(2vw, 16px);
  padding-left: max(1.5rem, 1.5vw);
  padding-right: max(1.5rem, 1.5vw);
  padding-top: max(1rem, 1vw);
  padding-bottom: max(1rem, 1vw);
  color: black;
  border: none;
  border-radius: 30px;
  &:hover {
    opacity: 85%;
  }
`;

const Button = ({ className, buttonText, clickHandler }: ButtonProps): JSX.Element => (
  <StyledButton className={className} type="button" onClick={clickHandler}>
    {buttonText}
  </StyledButton>
);
export default Button;
