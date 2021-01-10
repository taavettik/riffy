import styled from 'styled-components';
import { flexbox, FlexboxProps, layout, LayoutProps } from 'styled-system';

export const Input = styled.input<LayoutProps & FlexboxProps>`
  ${layout}
  ${flexbox}
  border: 1px solid ${(props) => props.theme.colors.gray.main};
  padding: 8px;
  border-radius: 4px;
  font-size: 16px;

  &:focus {
    outline: none;
  }
`;

export const TextArea = styled(Input).attrs({ as: 'textarea' })<
  {
    resize?: React.CSSProperties['resize'];
  } & LayoutProps
>`
  ${(props) => props.resize && `resize: ${props.resize}`};
`;
