import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Button from '../components/Button';

const RedirectButton = styled(Button)`
  background-color: red;
  // opacity: 25%;
  text-align: center;
  font-size: 36px;
  color: #0d2426;
  &:hover {
    opacity: 75%;
  }
  border-radius: 5px;
`;

const OAuthPlaceholder = () => {
  const navigate = useNavigate();
  const goToForm = (): void => {
    navigate('/form');
  };
  return (
    <>
      <h1>Oauth placeholder</h1>
      <RedirectButton
        buttonText="Redirect to user input form"
        clickHandler={goToForm}
      />
    </>
  );
};

export default OAuthPlaceholder;
