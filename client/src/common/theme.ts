import { TypographyProps } from 'styled-system';
import { CSSObject } from 'styled-components';

const typography = {
  heading: {
    fontSize: 40,
  },
  subheading: {
    fontSize: 30,
  },
  body: {
    fontSize: 16,
  },
};

export const theme = {
  colors: {
    gray: {
      lighter: '#E8EBED',
      light: '#DDE1E4',
      main: '#ced4da',
    },
    primary: {
      main: '#83c5be',
    },
  },
  borderRadius: '4px',
  typography,
};
