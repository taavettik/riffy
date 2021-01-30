import styled from 'styled-components';
import {
  flexbox,
  FlexboxProps,
  layout,
  LayoutProps,
  padding,
  PaddingProps,
} from 'styled-system';

export const Button = styled.button<
  { variant?: 'primary' | 'secondary' } & LayoutProps &
    PaddingProps &
    FlexboxProps
>`
  padding: 10px;
  ${padding}
  ${layout}
  ${flexbox}
  display: flex;
  justify-content: center;
  cursor: pointer;
  border-radius: ${(props) => props.theme.borderRadius};
  ${({ variant = 'primary', theme }) => {
    if (variant === 'primary') {
      return `
        background-color: ${theme.colors.primary.lighter};
        border: 1px solid ${theme.colors.primary.dark};
        &:focus {
          box-shadow: 0 0 0 1px ${theme.colors.primary.dark};
        }
        &:active,
        &:focus,
        &:hover {
          background-color: ${theme.colors.primary.lightest}
        }
      `;
    }
  }}

  &:focus {
    outline: none;
  }
`;
