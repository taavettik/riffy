import styled from 'styled-components';
import { layout, LayoutProps } from 'styled-system';

export const Input = styled.input`
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
  ${layout};
  ${(props) => props.resize && `resize: ${props.resize}`};
`;
