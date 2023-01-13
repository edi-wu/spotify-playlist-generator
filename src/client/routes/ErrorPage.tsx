import React, { MouseEventHandler } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-contents: center;
`;

const ErrorText = styled.h3`
  font-weight: 300;
  font-size: max(3vw, 24px);
  margin-top: 30vh;
`;

const GoHomeButton = styled(Button)`
  background-color: #1db954;
  text-align: center;
  font-size: max(2vw, 16px);
  margin-top: 15vh;
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

const ErrorPage = (): JSX.Element => {
  const navigate = useNavigate();
  const goToHome: MouseEventHandler<HTMLButtonElement> = (): void => {
    navigate('/');
  };
  return (
    <Container>
      <ErrorText>Something went wrong. Please try again.</ErrorText>
      <GoHomeButton buttonText="Return Home" clickHandler={goToHome} />
    </Container>
  );
};

export default ErrorPage;
