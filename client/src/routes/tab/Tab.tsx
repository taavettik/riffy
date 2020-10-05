import { Page } from '../../common/components/Page';
import { h } from 'preact';
import { useParams } from 'react-router';
import { gql, useQuery } from '@apollo/client';
import { GetTab, GetTabVariables } from '../../generated/GetTab';
import { Container } from '../../common/components/Container';
import styled from 'styled-components';

export const Tab = () => {
  const { id } = useParams<{ id: string }>();

  const { data } = useQuery<GetTab, GetTabVariables>(GET_TAB, {
    variables: {
      id,
    },
  });

  if (!data) {
    return <div></div>;
  }

  return (
    <Page title={`${data.getTab.trackArtist} - ${data.getTab.trackTitle}`}>
      <ChordsContainer>{data.getTab.chords}</ChordsContainer>
    </Page>
  );
};

const ChordsContainer = styled(Container)`
  white-space: pre-wrap;
`;

const GET_TAB = gql`
  query GetTab($id: String!) {
    getTab(id: $id) {
      id
      chords
      trackTitle
      trackArtist
    }
  }
`;
