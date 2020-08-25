import { Container } from '../components/Container';
import { h } from 'preact';
import { theme } from '../theme';

export const LeftDock = () => {
  return (
    <Container
      background={theme.colors.primary.main}
      borderRight={`1px solid ${theme.colors.gray.light}`}
      width={300}
      height="100%"
    ></Container>
  );
};
