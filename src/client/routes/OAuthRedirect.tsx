import { ENDPOINTS } from '../constants';

const OAuthRedirect = (): null => {
  window.location.replace(`${ENDPOINTS.oauth}`);
  return null;
};

export default OAuthRedirect;
