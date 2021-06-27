/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: MarkExternalTabFavourite
// ====================================================

export interface MarkExternalTabFavourite_markExternalTabFavourite {
  __typename: "ExternalTab";
  url: string;
  isFavourite: boolean;
}

export interface MarkExternalTabFavourite {
  markExternalTabFavourite: MarkExternalTabFavourite_markExternalTabFavourite;
}

export interface MarkExternalTabFavouriteVariables {
  url: string;
  target: boolean;
}
