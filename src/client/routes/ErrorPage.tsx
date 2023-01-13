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

const ErrorPage = (): JSX.Element => {
  const navigate = useNavigate();
  const goToHome: MouseEventHandler<HTMLButtonElement> = (): void => {
    navigate('/');
  };
  return (
    <Container>
      <ErrorText>Something went wrong. Please try again.</ErrorText>
      <Button buttonText="Return Home" clickHandler={goToHome} />
    </Container>
  );
};

export default ErrorPage;
