import { gql, useMutation, useQuery } from '@apollo/client';
import { h } from 'preact';
import { useEffect } from 'preact/hooks';
import { useParams } from 'react-router';
import { Chords } from '../../common/components/Chords';
import { Page } from '../../common/components/Page';
import { GetUgTab, GetUgTabVariables } from '../../generated/GetUgTab';

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

  useEffect(() => {
    addRecent();
  }, []);

  if (!data) {
    return <div></div>;
  }

  const trackName =
    [data.getUgTab?.trackArtist, data.getUgTab?.trackTitle]
      .filter(Boolean)
      .join(' - ') || 'Unknown track';

  const chords = data.getUgTab?.chords;

  return (
    <Page title={trackName} backButtonLink={'/'} showBackButton>
      <Chords chords={chords || 'No chords found'} />
    </Page>
  );
};

const GET_UG_TAB = gql`
  query GetUgTab($url: String!) {
    getUgTab(url: $url) {
      trackTitle
      trackArtist
      chords
    }
  }
`;

const ADD_RECENT_EXTERNAL_TAB = gql`
  mutation AddRecentExternalTab($url: String!) {
    addRecentExternalTab(url: $url)
  }
`;
