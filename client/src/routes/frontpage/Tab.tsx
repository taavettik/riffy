import { Container } from '../../common/components/Container';
import { h } from 'preact';
import { theme } from '../../common/theme';
import { Icon } from '../../common/components/Icon';

export const Tab = () => {
  return (
    <Container
      borderRadius={theme.borderRadius}
      background="white"
      padding={16}
      flexDirection={'column'}
      border={`1px solid ${theme.colors.gray.light}`}
      width={128}
    >
      <Container>
        <Icon size={128} icon="audiotrack" />
      </Container>
      <Container>Tämä kala pääsi karkuun</Container>
    </Container>
  );
};
