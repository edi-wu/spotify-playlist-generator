import React from 'react';
import styled from 'styled-components';
import { AlertProps } from '../types';

const StyledAlert = styled.div`
  margin-top: 15px;
  font-size: max(14px, 1vw);
  color: red;
`;

const Alert = ({ className, message }: AlertProps): JSX.Element => (
  <StyledAlert className={className} data-testid="alertMessage">
    {message}
  </StyledAlert>
);
export default Alert;
