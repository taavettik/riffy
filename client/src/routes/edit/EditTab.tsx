import { useQuery } from '@apollo/client';
import { h } from 'preact';
import { useEffect, useState } from 'preact/hooks';
import { useParams } from 'react-router';
import { TextArea } from '../../common/components/Input';

import { Page } from '../../common/components/Page';
import { GET_TAB } from '../../common/queries';
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

  useEffect(() => {
    if (!data || chords) {
      return;
    }
    setChords(data.getTab.chords);
    setInitialChords(data.getTab.chords);
  }, [data, chords]);

  if (!data) {
    return <div></div>;
  }

  const tab = data.getTab;

  return (
    <Page
      title={`Editing ${tab.trackArtist} - ${tab.trackTitle}`}
      showBackButton
    >
      <TextArea
        spellCheck="false"
        width="100%"
        resize="none"
        onChange={(e) => setChords(e.target.value)}
      >
        {chords}
      </TextArea>
    </Page>
  );
};
