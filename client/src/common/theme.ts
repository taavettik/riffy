import { TypographyProps } from 'styled-system';
import { CSSObject } from 'styled-components';

const typography: Record<string, React.CSSProperties> = {
  heading: {
    fontSize: 40,
  },
  subheading: {
    fontSize: 30,
  },
  label: {
    fontSize: 20,
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
      darkest: '#377670',
      darker: '#428f87',
      dark: '#4faaa0',
      main: '#83c5be',
      light: '#95cdc7',
      lighter: '#a8d6d1',
      lightest: '#c7e4e1',
    },
  },
  borderRadius: '4px',
  typography,
};
