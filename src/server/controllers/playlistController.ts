/* eslint-disable @typescript-eslint/naming-convention */
import spotifyApi from '../utils/apiWrapper';
import { getErrorDetails, convertInputToMilliseconds, getMaxTrackDuration } from '../utils/helpers';
import { Controller, ServerError } from '../types';
import { ERROR_MESSAGES, ONE_MIN_IN_MS } from '../constants';

const playlistController: Controller = {};

playlistController.createPlaylist = async (req, res, next) => {
  try {
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
    // pad target time by 1 min. so playlist may go a little over
    let timeLeft: number = targetPlaylistLength + ONE_MIN_IN_MS;
    while (timeLeft > ONE_MIN_IN_MS) {
      // max duration of track based on time left and preset max length (15 min)
      // set minimum to 3 minutes so last song can have more variety
      const max_duration_ms: number = getMaxTrackDuration(timeLeft);
      const options = {
        seed_genres: [genres],
        min_duration_ms: ONE_MIN_IN_MS,
        max_duration_ms,
        limit: 1,
      };
      // cannot use promise.all since each track length is unknown until response is received
      // eslint-disable-next-line no-await-in-loop
      const response = await spotifyApi.getRecommendations(options);
      const track = response.body.tracks[0];
      // throw error only if no tracks returned on the first request
      if (!track && trackList.length === 0) {
        const noTracksReturnedError: ServerError = {
          log: `${ERROR_MESSAGES.trackGenerationFailed.log}`,
          status: 400,
          message: { err: `${ERROR_MESSAGES.trackGenerationFailed.response}` },
        };
        return next(noTracksReturnedError);
      }
      const { duration_ms, uri } = track;
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

playlistController.addTracks = async (req, res, next) => {
  try {
    await spotifyApi.addTracksToPlaylist(res.locals.playlistId, res.locals.tracks);
    return next();
  } catch (err: unknown) {
    const [errorLog, errorStatus] = getErrorDetails(err);
    const trackAdditionError: ServerError = {
      log: errorLog,
      status: errorStatus,
      message: { err: `${ERROR_MESSAGES.trackAdditionFailed.response}` },
    };
    return next(trackAdditionError);
  }
};

playlistController.returnPlaylist = (req, res) => {
  res.status(200).json(res.locals.playlistId);
};

export default playlistController;
