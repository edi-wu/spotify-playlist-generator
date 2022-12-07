import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Button from '../components/Button';

const RedirectButton = styled(Button)`
  background-color: pink;
  // opacity: 25%;
  text-align: center;
  font-size: 36px;
  color: #0d2426;
  &:hover {
    opacity: 75%;
  }
  border-radius: 5px;
`;

const FormPage = () => {
  // TODO: if attempting to access this page before auth, should trigger redirect
  // implement by updating route with auth wrapper
  // should pass redirect flag to homepage upon redirect to display message
  // about auth to proceed
  const navigate = useNavigate();
  const goToPlayer = (): void => {
    navigate('/player');
  };
  return (
    <>
      <h1>This is the placeholder for user input form</h1>
      <RedirectButton
        buttonText="Redirect to player"
        clickHandler={goToPlayer}
      />
    </>
  );
};

export default FormPage;
