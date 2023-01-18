import React from 'react';
import styled from 'styled-components';
import { useLocation } from 'react-router-dom';
import NavBar from '../components/NavBar';
import WebPlayer from '../components/WebPlayer';

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const WebPlayerPage = (): JSX.Element => {
  const location = useLocation();
  return (
    <PageContainer>
      <NavBar />
      <WebPlayer
        playlistUri={location.state.playlistId}
        playlistTitle={location.state.playlistTitle}
      />
    </PageContainer>
  );
};

export default WebPlayerPage;
