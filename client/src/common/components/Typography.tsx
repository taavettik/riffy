import styled from 'styled-components';
import { TypographyProps, typography } from 'styled-system';
import { theme } from '../theme';
import { h } from 'preact';

const Typography = styled.span<TypographyProps>`
  ${typography}
`;

const createTypographyComponent = (name: keyof typeof theme['typography']) => {
  const style = theme.typography[name];
  const component: React.FC<TypographyProps> = ({ children, ...props }) => (
    <Typography {...style} {...props}>
      {children}
    </Typography>
  );
  return component;
};

export const Heading = createTypographyComponent('heading');
export const Subheading = createTypographyComponent('subheading');
export const Body = createTypographyComponent('body');
