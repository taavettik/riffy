import { h } from 'preact';
import { Spacing } from './Spacing';
import { TabLink } from './TabLink';
import { UgIcon } from './UgIcon';
import { Body } from './Typography';
import { Container } from './Container';
import { StarIcon } from '../icons';
import { IconButton } from './IconButton';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { FavouriteButton } from './tabs/FavouriteButton';

type Tab =
  | {
      __typename: 'Tab';
      id: string;
      trackTitle: string;
      artist?: {
        name: string;
      } | null;
      isFavourite?: boolean;
    }
  | {
      __typename: 'ExternalTab';
      url: string;
      trackTitle: string;
      trackArtist: string;
      isFavourite?: boolean;
    };

export const TabLinks = ({ tabs }: { tabs: Tab[] }) => {
  return (
    <>
      {tabs.map((tab, i) => {
        const tabInfo =
          tab.__typename === 'Tab'
            ? {
                id: tab.id,
              }
            : {
                url: tab.url,
              };

        const endAdornment = (
          <>
            <FavouriteButton
              style={{
                // WHY TF STYLED COMPONENTS FAILS ME ON THIS MOMENT ??
                // my trusty companion
                opacity: tab.isFavourite ? 1 : 'var(--button-opacity)',
              }}
              isFavourite={tab.isFavourite ?? false}
              {...tabInfo}
            />

            <Spacing dir="x" amount={16} />
          </>
        );

        const label = [
          'trackArtist' in tab ? tab.trackArtist : tab.artist?.name,
          tab.trackTitle,
        ]
          .filter(Boolean)
          .join(' - ');

        if (tab.__typename === 'Tab') {
          return (
            <TabLinkRow key={i}>
              <PlainLink to={`/tab/${tab.id}`}>{label}</PlainLink>
              <Spacing dir="x" amount={8} /> {endAdornment}
            </TabLinkRow>
          );
        }
        return (
          <TabLinkRow key={i}>
            <PlainLink to={`/ug/${encodeURIComponent(tab.url)}`}>
              {label}
            </PlainLink>{' '}
            <Spacing dir="x" amount={8} /> {endAdornment}{' '}
            <Spacing dir="x" amount={8} /> <UgIcon />
          </TabLinkRow>
        );
      })}
    </>
  );
};

const PlainLink = styled(Link)`
  color: inherit;
  text-decoration: none;
  width: 100%;
`;

const TabLinkRow = styled(TabLink).attrs({
  as: 'div',
})`
  display: flex;

  --button-opacity: 0;

  :hover {
    --button-opacity: 1;
  }
` as React.FC;
