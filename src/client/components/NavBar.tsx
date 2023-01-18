import React, { MouseEventHandler } from 'react';
import styled from 'styled-components';
import Button from './Button';

const Container = styled.div`
  display: flex;
  background-color: #1db954;
  opacity: 80%;
  padding-left: 20px;
  padding-right: 20px;
  align-items: center;
  justify-content: space-between;
`;

const Title = styled.h1`
  font-weight: 400;
  font-size: max(2vw, 20px);
  color: #111;
`;

const LogoutButton = styled(Button)`
  background-color: goldenrod;
  padding-left: 1.5rem;
  padding-right: 1.5rem;
  padding-top: 0.85rem;
  padding-bottom: 0.85rem;
  font-size: max(1.5vw, 16px);
`;

const NavBar = (): JSX.Element => {
  const handleLogout: MouseEventHandler<HTMLButtonElement> = async (event) => {
    event.preventDefault();
    console.log('logging out');
  };
  return (
    <Container>
      <Title>Axolotl Beats</Title>
      <LogoutButton buttonText="Log out" clickHandler={handleLogout} />
    </Container>
  );
};

export default NavBar;
