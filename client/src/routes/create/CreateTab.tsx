import { h } from 'preact';
import { Container } from '../../common/components/Container';
import { Input, TextArea } from '../../common/components/Input';
import { Page } from '../../common/components/Page';
import { Spacing } from '../../common/components/Spacing';
import { Body, Label } from '../../common/components/Typography';

export const CreateTab = () => {
  return (
    <Page title="Create tab">
      <Container width="100%" height="100%" flexDirection="row">
        <Container maxWidth="300px" width="100%" flexDirection="column">
          <Body>Artist</Body>
          <Spacing dir="y" amount={4} />
          <Input></Input>
          <Spacing dir="y" amount={8} />
          <Body>Title</Body>
          <Spacing dir="y" amount={4} />
          <Input></Input>
        </Container>
        <Spacing dir="x" amount={16} />
        <Container width="100%" flexDirection="column">
          <Body>Chords</Body>
          <Spacing dir="y" amount={4} />
          <TextArea width="100%" height="100%" resize="none"></TextArea>
        </Container>
      </Container>
    </Page>
  );
};
