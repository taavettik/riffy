import { Page } from '../../common/components/Page';
import { h } from 'preact';
import { useHistory, useParams } from 'react-router';
import { gql, useMutation, useQuery } from '@apollo/client';
import { GetTab, GetTabVariables } from '../../generated/GetTab';
import { Container } from '../../common/components/Container';
import styled from 'styled-components';
import { MdEdit } from 'react-icons/md';
import { IconButton } from '../../common/components/IconButton';
import { GET_TAB } from '../../common/queries';
import { Chords } from '../../common/components/Chords';
import {
  AddRecentTab,
  AddRecentTabVariables,
} from '../../generated/AddRecentTab';
import { useEffect } from 'preact/hooks';

export const Tab = () => {
  const { id } = useParams<{ id: string }>();

  const { data } = useQuery<GetTab, GetTabVariables>(GET_TAB, {
    variables: {
      id,
    },
  });

  const [addRecent] = useMutation<AddRecentTab, AddRecentTabVariables>(
    ADD_RECENT_TAB,
    {
      variables: { id },
    },
  );

  const history = useHistory();

  useEffect(() => {
    addRecent();
  }, []);

  if (!data) {
    return <div></div>;
  }

  return (
    <Page
      title={`${data.getTab.artist?.name} - ${data.getTab.trackTitle}`}
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

const ADD_RECENT_TAB = gql`
  mutation AddRecentTab($id: String!) {
    addRecentTab(id: $id)
  }
`;
