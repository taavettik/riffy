/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: FetchTrackInfo
// ====================================================

export interface FetchTrackInfo_fetchTrackInfo {
  __typename: "TrackInfo";
  id: number;
  artist: string;
  title: string;
  isrc: string;
}

export interface FetchTrackInfo {
  fetchTrackInfo: FetchTrackInfo_fetchTrackInfo;
}

export interface FetchTrackInfoVariables {
  id: number;
}
