import { Page } from '../../common/components/Page';
import { h } from 'preact';
import { useHistory, useParams } from 'react-router';
import { gql, useQuery } from '@apollo/client';
import { GetTab, GetTabVariables } from '../../generated/GetTab';
import { Container } from '../../common/components/Container';
import styled from 'styled-components';
import { MdEdit } from 'react-icons/md';
import { IconButton } from '../../common/components/IconButton';
import { GET_TAB } from '../../common/queries';
import { Chords } from '../../common/components/Chords';

export const Tab = () => {
  const { id } = useParams<{ id: string }>();

  const { data } = useQuery<GetTab, GetTabVariables>(GET_TAB, {
    variables: {
      id,
    },
  });

  const history = useHistory();

  if (!data) {
    return <div></div>;
  }

  return (
    <Page
      title={`${data.getTab.trackArtist} - ${data.getTab.trackTitle}`}
      actions={
        <>
          <IconButton
            icon={MdEdit}
            size={24}
            onClick={() => history.push(`/edit/${id}`)}
          />
        </>
      }
      backButtonLink="/"
      showBackButton
    >
      <Chords chords={data.getTab.chords} />
    </Page>
  );
};
