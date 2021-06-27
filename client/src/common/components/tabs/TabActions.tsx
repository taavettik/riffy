import { useMutation } from '@apollo/client';
import gql from 'graphql-tag';
import { h } from 'preact';
import {
  MarkExternalTabFavourite,
  MarkExternalTabFavouriteVariables,
} from '../../../generated/MarkExternalTabFavourite';
import {
  MarkTabFavourite,
  MarkTabFavouriteVariables,
} from '../../../generated/MarkTabFavourite';
import { PopupIcon, StarEmptyIcon, StarIcon } from '../../icons';
import { IconButton } from '../IconButton';
import { Spacing } from '../Spacing';

type TabActionsProps = {
  onTogglePopup: () => void;
  isFavourite: boolean;
} & (
  | {
      url: string;
    }
  | { id: string }
);

export const TabActions = ({
  onTogglePopup,
  isFavourite,
  ...info
}: TabActionsProps) => {
  const [markTabFavourite] = useMutation<
    MarkTabFavourite,
    MarkTabFavouriteVariables
  >(MARK_TAB_FAVOURITE, {
    refetchQueries: ['FavouriteTabs'],
  });
  const [markExternalTabFavourite] = useMutation<
    MarkExternalTabFavourite,
    MarkExternalTabFavouriteVariables
  >(MARK_EXTERNAL_TAB_FAVOURITE, {
    refetchQueries: ['FavouriteTabs', 'GetUgTab'],
  });

  const onMarkFavourite = () => {
    if ('url' in info) {
      markExternalTabFavourite({
        variables: {
          url: info.url,
          target: !isFavourite,
        },
      });
      return;
    }

    markTabFavourite({
      variables: {
        id: info.id,
        target: !isFavourite,
      },
    });
  };

  return (
    <>
      <IconButton
        icon={isFavourite ? StarIcon : StarEmptyIcon}
        onClick={() => {
          onMarkFavourite();
        }}
        size={24}
      />

      <Spacing dir="x" amount={24} />

      <PopupButton onClick={() => onTogglePopup()} />

      <Spacing dir="x" amount={24} />
    </>
  );
};

export const PopupButton = ({ onClick }: { onClick: () => void }) => {
  return (
    <IconButton
      icon={PopupIcon}
      size={24}
      onClick={() => {
        onClick();
        if (!(document.activeElement instanceof HTMLElement)) {
          return;
        }
        // remove focus from the button after clicking
        // not sure about accessibility
        document.activeElement.blur();
      }}
    />
  );
};

const MARK_TAB_FAVOURITE = gql`
  mutation MarkTabFavourite($id: String!, $target: Boolean!) {
    markTabFavourite(id: $id, target: $target) {
      id
      isFavourite
    }
  }
`;

const MARK_EXTERNAL_TAB_FAVOURITE = gql`
  mutation MarkExternalTabFavourite($url: String!, $target: Boolean!) {
    markExternalTabFavourite(url: $url, target: $target) {
      id
      isFavourite
    }
  }
`;
