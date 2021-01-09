import { h } from 'preact';
import {
  FlexboxProps,
  SpaceProps,
  SizeProps,
  flexbox,
  space,
  size,
  LayoutProps,
  layout,
  BackgroundProps,
  background,
  BordersProps,
  borders,
  typography,
  TypographyProps,
} from 'styled-system';
import styled from 'styled-components';

export type ContainerProps = FlexboxProps &
  SpaceProps &
  SizeProps &
  LayoutProps &
  BackgroundProps &
  BordersProps &
  TypographyProps;

export const Container = styled.div<ContainerProps>`
  display: flex;
  ${typography}
  ${flexbox}
  ${space}
  ${size}
  ${layout}
  ${background}
  ${borders}
`;
