import { ComponentType, h } from 'preact';
import { IconBaseProps } from 'react-icons/lib';
import styled from 'styled-components';
import { Container } from './Container';

export const IconButton = ({
  icon,
  onClick,
  ...props
}: { icon: ComponentType; onClick?: () => void } & IconBaseProps) => {
  return <Button onClick={onClick}>{h(icon, { ...props } as any)}</Button>;
};

const Button = styled.button`
  cursor: pointer;
  background: none;
  border: none;
  padding: 0;
  display: flex;

  &:focus {
    outline: none;
  }
`;
