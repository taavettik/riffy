import { gql, useMutation, useQuery } from '@apollo/client';
import { h } from 'preact';
import { useEffect, useState } from 'preact/hooks';
import { useHistory, useParams } from 'react-router';
import { Chords } from '../../common/components/Chords';
import { Container } from '../../common/components/Container';
import { IconButton } from '../../common/components/IconButton';
import { Page } from '../../common/components/Page';
import { Spacing } from '../../common/components/Spacing';
import { TabActions } from '../../common/components/tabs/TabActions';
import { UgIcon } from '../../common/components/UgIcon';
import { DownloadIcon } from '../../common/icons';
import { GET_UG_TAB } from '../../common/queries';
import { GetUgTab, GetUgTabVariables } from '../../generated/GetUgTab';
import {
  SetExternalTabTransposition,
  SetExternalTabTranspositionVariables,
} from '../../generated/SetExternalTabTransposition';

export const Ug = () => {
  const { url } = useParams<{ url: string }>();

  const decodedUrl = decodeURIComponent(url);

  const { data, error } = useQuery<GetUgTab, GetUgTabVariables>(GET_UG_TAB, {
    variables: {
      url: decodedUrl,
    },
  });

  const [addRecent] = useMutation(ADD_RECENT_EXTERNAL_TAB, {
    variables: {
      url: decodedUrl,
    },
  });

  const [setTransposition] = useMutation<
    SetExternalTabTransposition,
    SetExternalTabTranspositionVariables
  >(SET_EXTERNAL_TAB_TRANSPOSITION);

  useEffect(() => {
    addRecent();
  }, []);

  const [popupOpen, setPopupOpen] = useState(false);

  const history = useHistory();

  if (!data) {
    return <div></div>;
  }

  const trackName =
    [data.getUgTab?.trackArtist, data.getUgTab?.trackTitle]
      .filter(Boolean)
      .join(' - ') || 'Unknown track';

  const chords = data.getUgTab?.chords;

  const onImport = () => {
    history.push('/create', {
      trackTitle: data.getUgTab?.trackTitle,
      trackArtist: data.getUgTab?.trackArtist,
      chords,
    });
  };

  return (
    <Page
      title={
        <Container alignItems="center">
          {trackName} <Spacing dir="x" amount={8} /> <UgIcon />
        </Container>
      }
      actions={
        <>
          <TabActions
            url={decodedUrl}
            isFavourite={data.getUgTab?.isFavourite ?? false}
            onTogglePopup={() => setPopupOpen((open) => !open)}
          />

          <IconButton
            onClick={() => onImport()}
            size={24}
            icon={DownloadIcon}
          />
        </>
      }
      backButtonLink={'/'}
      showBackButton
    >
      <Spacing dir="y" amount={16} />

      <Chords
        chords={chords || 'No chords found'}
        onTranspose={(transposition) =>
          setTransposition({
            variables: {
              url: decodedUrl,
              transposition,
            },
          })
        }
        initialTransposition={data.getUgTab?.transposition}
        popupOpen={popupOpen}
        togglePopup={setPopupOpen}
      />
    </Page>
  );
};

const SET_EXTERNAL_TAB_TRANSPOSITION = gql`
  mutation SetExternalTabTransposition($url: String!, $transposition: Float!) {
    setExternalTabTransposition(url: $url, transposition: $transposition) {
      url
      transposition
    }
  }
`;

const ADD_RECENT_EXTERNAL_TAB = gql`
  mutation AddRecentExternalTab($url: String!) {
    addRecentExternalTab(url: $url)
  }
`;
