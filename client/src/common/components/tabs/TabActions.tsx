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
import { FavouriteButton } from './FavouriteButton';

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
  return (
    <>
      <FavouriteButton isFavourite={isFavourite} {...info} />

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
