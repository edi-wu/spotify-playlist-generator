/* eslint-disable @typescript-eslint/naming-convention */
import spotifyApi from '../utils/apiWrapper';
import { getErrorDetails, convertInputToMilliseconds } from '../utils/helpers';
import { Controller, ServerError } from '../types';
import { ERROR_MESSAGES, MAX_TRACK_LENGTH, ONE_MIN_IN_MS } from '../constants';

const playlistController: Controller = {};

playlistController.createPlaylist = async (req, res, next) => {
  try {
    spotifyApi.setAccessToken(req.cookies.access);
    // this functionality does not require refresh token; TODO: create route to refresh token
    // spotifyApi.setRefreshToken(req.cookies.refresh);
    // TODO: look into typing req body
    // TODO: verify behavior when playlist title not provided
    const { title, description } = req.body;
    const titleParam = title.length === 0 ? 'untitled playlist' : title;
    const data = await spotifyApi.createPlaylist(`${titleParam}`, {
      description: `${description}`,
      public: true,
    });
    res.locals.playlistId = data.body.id;
    return next();
  } catch (err: unknown) {
    const [errorLog, errorStatus] = getErrorDetails(err);
    const playlistCreationError: ServerError = {
      log: errorLog,
      status: errorStatus,
      message: { err: `${ERROR_MESSAGES.playlistCreationFailed.response}` },
    };
    return next(playlistCreationError);
  }
};

playlistController.getRecommendations = async (req, res, next) => {
  try {
    const { durationHours, durationMinutes, genres } = req.body;
    const trackList: string[] = [];
    const targetPlaylistLength: number = convertInputToMilliseconds(durationHours, durationMinutes);
    let timeLeft: number = targetPlaylistLength;
    while (timeLeft > 0) {
      // max duration of track based on time left, within range of 1 min to MAX_TRACK_LENGTH
      const max_duration_ms: number = Math.max(ONE_MIN_IN_MS, Math.min(MAX_TRACK_LENGTH, timeLeft));
      const options = { seed_genres: [genres], max_duration_ms, limit: 1 };
      // cannot use promise.all since each track length is unknown until response is received
      // eslint-disable-next-line no-await-in-loop
      const response = await spotifyApi.getRecommendations(options);
      const { duration_ms, uri } = response.body.tracks[0];
      timeLeft -= duration_ms;
      trackList.push(uri);
    }
    res.locals.tracks = trackList;
    return next();
  } catch (err: unknown) {
    const [errorLog, errorStatus] = getErrorDetails(err);
    const trackGenerationError: ServerError = {
      log: errorLog,
      status: errorStatus,
      message: { err: `${ERROR_MESSAGES.trackGenerationFailed.response}` },
    };
    return next(trackGenerationError);
  }
};

playlistController.addTracks = async (req, res, next) => next();

playlistController.returnPlaylist = (req, res) => {
  res.status(200).json(res.locals.playlistId);
};

export default playlistController;
