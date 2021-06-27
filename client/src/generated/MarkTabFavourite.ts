/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: MarkTabFavourite
// ====================================================

export interface MarkTabFavourite_markTabFavourite {
  __typename: "Tab";
  id: string;
  isFavourite: boolean;
}

export interface MarkTabFavourite {
  markTabFavourite: MarkTabFavourite_markTabFavourite;
}

export interface MarkTabFavouriteVariables {
  id: string;
  target: boolean;
}
