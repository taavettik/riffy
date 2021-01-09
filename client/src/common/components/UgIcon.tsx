import styled from 'styled-components';
import { h } from 'preact';
import { layout, LayoutProps } from 'styled-system';

export const UgIcon = () => <IconContainer>UG</IconContainer>;

const IconContainer = styled.div<LayoutProps>`
  ${layout}
  border: 2px solid ${(p) => p.theme.colors.primary.main};
  padding: 2px;
  border-radius: ${(p) => p.theme.borderRadius};
  width: fit-content;
  user-select: none;
`;
