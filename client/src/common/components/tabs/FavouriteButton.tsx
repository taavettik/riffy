import { gql, useMutation } from '@apollo/client';
import { h } from 'preact';
import {
  MarkExternalTabFavourite,
  MarkExternalTabFavouriteVariables,
} from '../../../generated/MarkExternalTabFavourite';
import {
  MarkTabFavourite,
  MarkTabFavouriteVariables,
} from '../../../generated/MarkTabFavourite';
import { StarEmptyIcon, StarIcon } from '../../icons';
import { IconButton } from '../IconButton';

export const FavouriteButton = ({
  isFavourite,
  style,
  ...info
}: { isFavourite: boolean; style?: React.CSSProperties } & (
  | { id: string; url?: undefined }
  | { url: string; id?: undefined }
)) => {
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
    if (info.url) {
      markExternalTabFavourite({
        variables: {
          url: info.url,
          target: !isFavourite,
        },
      });
      return;
    }

    if (!info.id) {
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
    <IconButton
      style={style}
      icon={isFavourite ? StarIcon : StarEmptyIcon}
      onClick={() => {
        onMarkFavourite();
      }}
      size={24}
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
