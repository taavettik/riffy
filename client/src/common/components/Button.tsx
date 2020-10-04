import styled from 'styled-components';
import { layout, LayoutProps } from 'styled-system';

export const Button = styled.button<
  { variant?: 'primary' | 'secondary' } & LayoutProps
>`
  ${layout}
  padding: 10px;
  display: flex;
  justify-content: center;
  border-radius: ${(props) => props.theme.borderRadius};
  ${({ variant = 'primary', theme }) => {
    if (variant === 'primary') {
      return `
        background-color: ${theme.colors.primary.lighter};
        border: 1px solid ${theme.colors.primary.dark};
        &:focus {
          box-shadow: 0 0 0 1px ${theme.colors.primary.dark};
        }
      `;
    }
  }}

  &:focus {
    outline: none;
  }
`;
