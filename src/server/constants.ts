const ERROR_MESSAGES: Record<string, { log?: string; response?: string }> = {
  noEndpoint: {
    log: 'Request was made to an unavailable endpoint.',
    response: 'An error has occurred: endpoint not found.',
  },
  defaultError: {
    log: 'Express error handler caught unknown middleware error.',
    response: 'An unknown error has occurred.',
  },
  noClientId: {
    log: 'Missing Spotify client ID in .env.',
    response: 'An error has occurred: application is missing valid Spotify client ID.',
  },
  authFailed: {
    log: 'Spotify authorization failed.',
    response: 'An error has occurred: Spotify access denied.',
  },
  invalidState: {
    log: 'State validation failed.',
    response: 'An error has occurred: unable to confirm Spotify as response origin.',
  },
  tokenError: {
    log: 'Token generation failed.',
    response: 'An error has occurred: unable to obtain access token from Spotify.',
  },
  playlistCreationFailed: {
    response: 'Failed to create a new playlist.',
  },
  trackGenerationFailed: {
    response: 'Failed to get tracks based on user preferences.',
  },
  trackAdditionFailed: {
    response: 'Failed to add tracks to the playlist.',
  },
};

export default ERROR_MESSAGES;
