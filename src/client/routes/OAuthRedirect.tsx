import { ENDPOINTS } from '../constants';

const OAuthRedirect = () => {
  window.location.replace(`${ENDPOINTS.oauth}`);
  return null;
};

export default OAuthRedirect;
