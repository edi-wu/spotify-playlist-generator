import spotifyApi from '../utils/apiWrapper';
import { getErrorDetails, convertInputToMilliseconds } from '../utils/helpers';
import { Controller, ServerError } from '../types';
import ERROR_MESSAGES from '../constants';

const playlistController: Controller = {};

playlistController.createPlaylist = async (req, res, next) => {
  try {
    spotifyApi.setAccessToken(req.cookies.access);
    spotifyApi.setRefreshToken(req.cookies.refresh);
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
    // TODO: get params from req body, convert duration to ms
    const { durationHours, durationMinutes, genres } = req.body;
    const targetPlaylistLength: number = convertInputToMilliseconds(durationHours, durationMinutes);
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
    // TODO: add tracks to existing playlist
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
