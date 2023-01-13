import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  body {
    @import url('https://fonts.googleapis.com/css2?family=Roboto&display=swap');
    margin: 0;
    padding: 0;
    font-family: Roboto, Helvetica, Sans-Serif;
  }
`;

export default GlobalStyle;
