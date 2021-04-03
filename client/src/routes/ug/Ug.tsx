import { gql, useMutation, useQuery } from '@apollo/client';
import { h } from 'preact';
import { useEffect, useState } from 'preact/hooks';
import { useHistory, useParams } from 'react-router';
import { Chords } from '../../common/components/Chords';
import { Container } from '../../common/components/Container';
import { IconButton } from '../../common/components/IconButton';
import { Page } from '../../common/components/Page';
import { Spacing } from '../../common/components/Spacing';
import { UgIcon } from '../../common/components/UgIcon';
import { DownloadIcon } from '../../common/icons';
import { GetUgTab, GetUgTabVariables } from '../../generated/GetUgTab';
import {
  SetExternalTabTransposition,
  SetExternalTabTranspositionVariables,
} from '../../generated/SetExternalTabTransposition';
import { PopupButton } from '../tab/Tab';

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
          <PopupButton onClick={() => setPopupOpen((open) => !open)} />

          <Spacing dir="x" amount={24} />

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

const GET_UG_TAB = gql`
  query GetUgTab($url: String!) {
    getUgTab(url: $url) {
      trackTitle
      trackArtist
      chords
      transposition
    }
  }
`;

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
