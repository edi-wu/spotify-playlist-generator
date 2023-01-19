import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { playPlaylist } from '../services/playlistService';
import getCookie from '../utils/getCookie';
import { WebPlayerProps } from '../types';

const PlayerContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const PlaylistTitle = styled.h1`
  font-weight: 300;
  font-size: max(5vw, 36px);
  margin-top: 25vh;
`;

const TrackName = styled.h1`
  font-weight: 300;
  font-size: max(3vw, 16px);
  margin-top: 15vh;
`;

const WebPlayer = ({ playlistUri, playlistTitle }: WebPlayerProps): JSX.Element => {
  const [player, setPlayer] = useState<Spotify.Player | undefined>(undefined);
  const [deviceId, setDeviceId] = useState<string>('');
  const [playerIsReady, setPlayerIsReady] = useState<boolean>(false);
  const [isActive, setIsActive] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [currentTrack, setCurrentTrack] = useState<Spotify.Track | null>(null);

  const accessToken = getCookie('access');

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://sdk.scdn.co/spotify-player.js';
    script.async = true;

    document.body.appendChild(script);

    window.onSpotifyWebPlaybackSDKReady = () => {
      const webPlayer = new window.Spotify.Player({
        name: 'Axolotl Beats Web Player',
        getOAuthToken: (cb) => {
          cb(accessToken);
        },
        volume: 0.5,
      });

      setPlayer(webPlayer);

      webPlayer.addListener('ready', ({ device_id }) => {
        setDeviceId(device_id);
        setPlayerIsReady(true);
        console.log('Ready with Device ID', device_id);
      });

      webPlayer.addListener('not_ready', ({ device_id }) => {
        setPlayerIsReady(false);
        console.log('Device ID has gone offline', device_id);
      });

      webPlayer.addListener('player_state_changed', (state) => {
        if (!state) {
          return;
        }

        setCurrentTrack(state.track_window.current_track);
        setIsPaused(state.paused);

        webPlayer.getCurrentState().then((playerState) => {
          if (!playerState) {
            setIsActive(false);
          } else {
            setIsActive(true);
          }
        });
      });

      webPlayer.connect();
    };
  }, []);

  useEffect(() => {
    if (!playerIsReady) return;
    playPlaylist(deviceId, playlistUri, accessToken);
  }, [playerIsReady]);

  return (
    <PlayerContainer>
      <PlaylistTitle>{`Created playlist: ${playlistTitle}`}</PlaylistTitle>
      {isActive && !isPaused && currentTrack ? (
        <TrackName>{`Now playing: "${currentTrack.name}" - ${currentTrack.artists[0].name}`}</TrackName>
      ) : null}
    </PlayerContainer>
  );
};

export default WebPlayer;
