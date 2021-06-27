import { h } from 'preact';
import { Spacing } from './Spacing';
import { TabLink } from './TabLink';
import { UgIcon } from './UgIcon';
import { Body } from './Typography';
import { Container } from './Container';

type Tab =
  | {
      __typename: 'Tab';
      id: string;
      trackTitle: string;
      artist?: {
        name: string;
      } | null;
    }
  | {
      __typename: 'ExternalTab';
      url: string;
      trackTitle: string;
      trackArtist: string;
    };

export const TabLinks = ({ tabs }: { tabs: Tab[] }) => {
  return (
    <>
      {tabs.map((tab, i) => {
        const label = [
          'trackArtist' in tab ? tab.trackArtist : tab.artist?.name,
          tab.trackTitle,
        ]
          .filter(Boolean)
          .join(' - ');

        if (tab.__typename === 'Tab') {
          return (
            <TabLink key={i} to={`/tab/${tab.id}`}>
              {label}
            </TabLink>
          );
        }
        return (
          <TabLink key={i} to={`/ug/${encodeURIComponent(tab.url)}`}>
            {label} <Spacing dir="x" amount={8} /> <UgIcon />
          </TabLink>
        );
      })}
    </>
  );
};
