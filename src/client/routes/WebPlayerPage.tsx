import React from 'react';
import { useLocation } from 'react-router-dom';
import WebPlayer from '../components/WebPlayer';

const WebPlayerPage = (): JSX.Element => {
  const location = useLocation();
  return (
    <>
      <div>This is the page for spotify web player</div>
      <WebPlayer playlistUri={location.state.playlistId} />
    </>
  );
};

export default WebPlayerPage;
