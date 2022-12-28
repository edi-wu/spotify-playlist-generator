import React, { useState, useEffect } from 'react';
import getCookie from '../utils/getCookie';
import { WebPlayerProps } from '../types';

const WebPlayer = ({ playlistUri }: WebPlayerProps): JSX.Element => {
  const accessToken = getCookie('access');
  const [player, setPlayer] = useState<Spotify.Player | undefined>(undefined);
  const [deviceId, setDeviceId] = useState<string>('');
  const [playerIsReady, setPlayerIsReady] = useState<boolean>(false);

  const play = (spotifyUri: string): void => {
    fetch(`https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`, {
      method: 'PUT',
      body: JSON.stringify({ context_uri: `spotify:playlist:${spotifyUri}` }),
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    });
  };

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

      webPlayer.connect();
    };
  }, []);

  useEffect(() => {
    if (!playerIsReady) return;
    console.log('this is the passed in uri', playlistUri);
    play(playlistUri);
  }, [playerIsReady]);

  return <div>Now Playing:</div>;
};

export default WebPlayer;
