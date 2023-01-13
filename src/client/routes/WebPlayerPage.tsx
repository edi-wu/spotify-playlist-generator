import React from 'react';
import { useLocation } from 'react-router-dom';
import WebPlayer from '../components/WebPlayer';

const WebPlayerPage = (): JSX.Element => {
  const location = useLocation();
  return (
    <WebPlayer
      playlistUri={location.state.playlistId}
      playlistTitle={location.state.playlistTitle}
    />
  );
};

export default WebPlayerPage;
