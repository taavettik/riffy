import styled from 'styled-components';
import { GridProps, grid } from 'styled-system';
import { Container } from './Container';

export const GridArea = styled.div<{ area: string }>`
  grid-area: ${props => props.area};
`;

export const Grid = styled(Container)<GridProps & { gridAreas: string[] }>`
  ${grid}
  display: grid;
  grid-template-areas: ${props => props.gridAreas.map(a => `"${a}"`).join(' ')};
`;
