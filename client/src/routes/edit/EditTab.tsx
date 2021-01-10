import { gql, useMutation, useQuery } from '@apollo/client';
import { h } from 'preact';
import { useEffect, useState } from 'preact/hooks';
import { useHistory, useParams } from 'react-router';
import { Button } from '../../common/components/Button';
import { Container } from '../../common/components/Container';
import { TextArea } from '../../common/components/Input';

import { Page } from '../../common/components/Page';
import { Spacing } from '../../common/components/Spacing';
import { Body } from '../../common/components/Typography';
import { GET_TAB } from '../../common/queries';
import { EditTab as IEditTab, EditTabVariables } from '../../generated/EditTab';
import { GetTab, GetTabVariables } from '../../generated/GetTab';

export const EditTab = () => {
  const { id } = useParams<{ id: string }>();

  const { data } = useQuery<GetTab, GetTabVariables>(GET_TAB, {
    variables: {
      id,
    },
  });

  const [initialChords, setInitialChords] = useState('');
  const [chords, setChords] = useState<string | undefined>(undefined);

  const history = useHistory();

  const [edit] = useMutation<IEditTab, EditTabVariables>(EDIT_TAB, {
    variables: {
      id,
      chords: chords || '',
    },
    onCompleted: () => history.goBack(),
  });

  useEffect(() => {
    if (!data || chords) {
      return;
    }
    setChords(data.getTab.chords);
    setInitialChords(data.getTab.chords);
  }, [data, chords]);

  const onSubmit = () => {
    edit();
  };

  if (!data) {
    return <div></div>;
  }

  const tab = data.getTab;

  return (
    <Page
      title={`Editing ${tab.artist?.name} - ${tab.trackTitle}`}
      showBackButton
    >
      <Container width="100%" height="100%" flexDirection="column">
        <TextArea
          spellCheck="false"
          width="100%"
          height="100%"
          resize="none"
          onChange={(e) => setChords(e.target.value)}
        >
          {chords}
        </TextArea>

        <Spacing dir="y" amount={16} />

        <Button onClick={() => onSubmit()} width="100px">
          <Body>Save</Body>
        </Button>
      </Container>
    </Page>
  );
};

const EDIT_TAB = gql`
  mutation EditTab($id: String!, $chords: String!) {
    editTab(id: $id, chords: $chords) {
      id
      chords
    }
  }
`;
