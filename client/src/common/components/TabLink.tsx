import { Link } from 'react-router-dom';
import styled from 'styled-components';

export const TabLink = styled(Link)`
  color: black;
  min-height: 40px;
  display: flex;
  width: 100%;
  text-decoration: none;
  border-bottom: 1px solid black;
  vertical-align: middle;
  align-items: center;

  :hover {
    color: ${(p) => p.theme.colors.primary.darkest};
    border-color: ${(p) => p.theme.colors.primary.darkest};
  }
`;
