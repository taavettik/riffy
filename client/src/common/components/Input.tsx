import styled from 'styled-components';

export const Input = styled.input`
  border: 1px solid ${(props) => props.theme.colors.gray.main};
  padding: 8px;
  border-radius: 4px;
  font-size: 16px;

  &:focus {
    outline: none;
  }
`;
