import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Button from '../components/Button';

const LoginButton = styled(Button)`
  background-color: goldenrod;
  // opacity: 25%;
  text-align: center;
  font-size: 36px;
  color: #0d2426;
  &:hover {
    opacity: 75%;
  }
  border-radius: 5px;
`;

const Homepage = () => {
  const navigate = useNavigate();
  const goToOAuth = (): void => {
    navigate('/oauth');
  };
  return (
    <>
      <h1>Axolotl Beats: a Spotify playlist generator</h1>
      <LoginButton buttonText="Login with Spotify" clickHandler={goToOAuth} />
    </>
  );
};

export default Homepage;
