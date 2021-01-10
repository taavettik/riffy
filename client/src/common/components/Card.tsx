import styled from 'styled-components';
import { Container, ContainerProps } from './Container';
import { h, VNode } from 'preact';
import { Subheading } from './Typography';
import { Spacing } from './Spacing';

const CardComponent: React.FC<
  ContainerProps & {
    heading: JSX.Element | string;
  }
> = ({ children, heading, ...props }) => {
  return (
    <Container {...props} flexDirection={'column'} padding={4}>
      <Container>
        {typeof heading === 'string' ? (
          <Subheading>{heading}</Subheading>
        ) : (
          heading
        )}
      </Container>
      <Spacing dir="y" amount={32} />
      <Container height={'calc(100% - 64px)'}>{children}</Container>
    </Container>
  );
};

export const Card = styled(CardComponent)`
  border: 1px solid ${(props) => props.theme.colors.gray.main};
  background-color: white;
  box-shadow: 1px 1px ${(props) => props.theme.colors.gray.light};
  border-radius: ${(props) => props.theme.borderRadius};
`;
