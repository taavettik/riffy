import styled from 'styled-components';
import {
  TypographyProps,
  typography,
  color,
  ColorProps,
  layout,
  LayoutProps,
  SizeProps,
  size,
} from 'styled-system';
import { theme } from '../theme';
import { h } from 'preact';

type Props = TypographyProps & ColorProps & LayoutProps & SizeProps;

const Typography = styled.span<Props>`
  width: 100%;
  ${typography}
  ${color}
  ${layout}
  ${size}
`;

const createTypographyComponent = (name: keyof typeof theme['typography']) => {
  const style = theme.typography[name];
  const component: React.FC<Props> = ({ children, ...props }) => (
    <Typography {...(style as any)} {...props}>
      {children}
    </Typography>
  );
  return component;
};

export const Heading = createTypographyComponent('heading');
export const Subheading = createTypographyComponent('subheading');
export const Label = createTypographyComponent('label');
export const Body = createTypographyComponent('body');
