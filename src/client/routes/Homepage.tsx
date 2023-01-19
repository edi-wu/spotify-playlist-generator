import React, { MouseEventHandler } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Button from '../components/Button';

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-contents: center;
`;

const Title = styled.h1`
  font-weight: 300;
  font-size: 10vw;
  margin-top: 20vh;
`;

const Homepage = (): JSX.Element => {
  const navigate = useNavigate();
  const goToOAuth: MouseEventHandler<HTMLButtonElement> = (): void => {
    navigate('/oauth');
  };
  return (
    <PageContainer>
      <Title>Axolotl Beats</Title>
      <Button buttonText="Login with Spotify" clickHandler={goToOAuth} />
    </PageContainer>
  );
};

export default Homepage;
