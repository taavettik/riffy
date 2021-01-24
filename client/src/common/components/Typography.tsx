import styled from 'styled-components';
import { TypographyProps, typography, color, ColorProps } from 'styled-system';
import { theme } from '../theme';
import { h } from 'preact';

const Typography = styled.span<TypographyProps & ColorProps>`
  width: 100%;
  ${typography}
  ${color}
`;

const createTypographyComponent = (name: keyof typeof theme['typography']) => {
  const style = theme.typography[name];
  const component: React.FC<TypographyProps & ColorProps> = ({
    children,
    ...props
  }) => (
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
