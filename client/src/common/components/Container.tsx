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
} from 'styled-system';
import styled from 'styled-components';

export type ContainerProps = FlexboxProps &
  SpaceProps &
  SizeProps &
  LayoutProps &
  BackgroundProps &
  BordersProps;

export const Container = styled.div<ContainerProps>`
  display: flex;
  ${flexbox}
  ${space}
  ${size}
  ${layout}
  ${background}
  ${borders}
`;
