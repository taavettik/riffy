import { Page } from '../../common/components/Page';
import { h } from 'preact';
import { useHistory, useParams } from 'react-router';
import { gql, useMutation, useQuery } from '@apollo/client';
import { GetTab, GetTabVariables } from '../../generated/GetTab';
import { Container } from '../../common/components/Container';
import styled from 'styled-components';
import { IconButton } from '../../common/components/IconButton';
import { GET_TAB } from '../../common/queries';
import { Chords } from '../../common/components/Chords';
import {
  AddRecentTab,
  AddRecentTabVariables,
} from '../../generated/AddRecentTab';
import { useEffect, useState } from 'preact/hooks';
import { DeleteIcon, EditIcon } from '../../common/icons';
import { Spacing } from '../../common/components/Spacing';
import { ConfirmModal } from '../../common/components/ConfirmModal';
import {
  SetTabTransposition,
  SetTabTranspositionVariables,
} from '../../generated/SetTabTransposition';
import { useMountQuery } from '../../common/hooks';

export const Tab = () => {
  const { id } = useParams<{ id: string }>();

  const { data } = useMountQuery<GetTab, GetTabVariables>(GET_TAB, {
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

  const [setTransposition] = useMutation<
    SetTabTransposition,
    SetTabTranspositionVariables
  >(SET_TRANSPOSITION);

  const [deleteTab] = useMutation(DELETE_TAB, {
    variables: { id },
    onCompleted: () => history.goBack(),
    refetchQueries: ['GetTabs'],
  });

  const history = useHistory();

  useEffect(() => {
    addRecent();
  }, []);

  const onDelete = () => {
    deleteTab();
  };

  const [open, setOpen] = useState(false);

  if (!data) {
    return <div></div>;
  }

  return (
    <Page
      title={`${data.getTab.artist?.name || ''} - ${data.getTab.trackTitle}`}
      actions={
        <>
          <IconButton
            icon={DeleteIcon}
            size={24}
            onClick={() => setOpen(true)}
          />

          <Spacing dir="x" amount={24} />

          <IconButton
            icon={EditIcon}
            size={24}
            onClick={() => history.push(`/edit/${id}`)}
          />
        </>
      }
      showBackButton
    >
      <Chords
        chords={data.getTab.chords}
        onTranspose={(transposition) =>
          setTransposition({
            variables: {
              id,
              transposition,
            },
          })
        }
        initialTransposition={data.getTab.transposition}
      />
      <ConfirmModal
        open={open}
        onClose={() => setOpen(false)}
        onConfirm={() => onDelete()}
      />
    </Page>
  );
};

const ADD_RECENT_TAB = gql`
  mutation AddRecentTab($id: String!) {
    addRecentTab(id: $id)
  }
`;

const SET_TRANSPOSITION = gql`
  mutation SetTabTransposition($id: String!, $transposition: Float!) {
    setTabTransposition(id: $id, transposition: $transposition) {
      id
      transposition
    }
  }
`;

const DELETE_TAB = gql`
  mutation DeleteTab($id: String!) {
    deleteTab(id: $id) {
      id
      tabs {
        id
      }
    }
  }
`;
