import styled from 'styled-components';
import { h } from 'preact';
import { Container } from './Container';

export const Tag: React.FC = ({ children }) => {
  return <TagContainer>{children}</TagContainer>;
};

const TagContainer = styled(Container)`
  border: 2px solid ${(p) => p.theme.colors.primary.main};
  padding: 2px;
  border-radius: ${(p) => p.theme.borderRadius};
  cursor: default;
`;
