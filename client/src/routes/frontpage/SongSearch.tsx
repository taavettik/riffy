import { Search } from '../../common/components/Search';
import { h } from 'preact';
import { useEffect, useState } from 'preact/hooks';
import { useHistory } from 'react-router';
import { gql, useLazyQuery, useMutation, useQuery } from '@apollo/client';
import { compareTwoStrings } from 'string-similarity';
import {
  SearchUgTabs,
  SearchUgTabsVariables,
} from '../../generated/SearchUgTabs';
import { Tooltip } from '../../common/components/Tooltip';
import { range } from '../../common/utils';
import { StarIcon, StarHalfIcon, StarEmptyIcon } from '../../common/icons';
import { Container } from '../../common/components/Container';
import { Spacing } from '../../common/components/Spacing';
import { SearchTabs, SearchTabsVariables } from '../../generated/SearchTabs';
import { useDebounce } from '../../common/hooks';

const UG_REGEX = /^https:\/\/tabs\.ultimate-guitar\.com/g;

type TabOption = {
  id: string;
  label: string;
} & (
  | {
      type: 'tab';
    }
  | {
      type: 'ug';
      rating: number;
      votes: number;
    }
  | {
      type: 'label';
    }
);

export const SongSearch = () => {
  const [value, setValue] = useState('');
  const [lastUgSearch, setLastUgSearch] = useState('');

  const ugOption = value.match(UG_REGEX)
    ? {
        id: value,
        label: `UG: ${value.replace(UG_REGEX, '')}`,
      }
    : undefined;

  const debouncedValue = useDebounce(500, value);

  const [searchUg, { data: ugTabs }] = useLazyQuery<
    SearchUgTabs,
    SearchUgTabsVariables
  >(SEARCH_UG_TABS, {
    fetchPolicy: 'no-cache',
  });
  const [search, { data: tabs }] = useLazyQuery<
    SearchTabs,
    SearchTabsVariables
  >(SEARCH_TABS);

  useEffect(() => {
    search({
      variables: {
        query: debouncedValue,
      },
    });
  }, [debouncedValue]);

  const ugOptions = ugTabs
    ? ugTabs.searchUgTabs.map((tab) => ({
        type: 'ug',
        id: tab.url,
        label: `${tab.trackArtist} - ${tab.trackTitle} (ver ${tab.version})`,
        rating: tab.rating,
        votes: tab.votes,
      }))
    : [];

  const tabOptions = tabs
    ? tabs.searchTabs.map((tab) => ({
        type: 'tab',
        id: tab.id,
        label: `${tab.artist?.name ?? ''} - ${tab.trackTitle}`,
      }))
    : [];

  const labelOptions =
    lastUgSearch === value
      ? []
      : [
          {
            type: 'label',
            id: 'label',
            label: 'Press enter to search UG',
          },
        ];

  const options = [...ugOptions, ...tabOptions]
    .sort((a, b) => {
      return (
        compareTwoStrings(value, a.label) - compareTwoStrings(value, b.label)
      );
    })
    .concat(labelOptions) as TabOption[];

  const history = useHistory();

  const executeSearch = () => {
    searchUg({ variables: { query: value } });
    setLastUgSearch(value);
  };

  return (
    <Search
      items={options}
      value={value}
      onChange={(value) => setValue(value)}
      onSelect={(item, cancel) => {
        if (item.type === 'label') {
          // don't close the search options
          cancel(true);
          executeSearch();
          return;
        }
        if (item.type === 'tab') {
          history.push(`/tab/${item.id}`);
          return;
        }
        history.push(`/ug/${encodeURIComponent(item.id)}`);
      }}
      width="auto"
      inputProps={{
        onKeyDown: (e) => {
          if (e.key === 'Enter') {
            executeSearch();
          }
        },
      }}
      placeholder="Search tabs..."
      renderItem={(item) => {
        if (item.type === 'tab') {
          return <div>{item.label}</div>;
        }

        if (item.type === 'label') {
          return <div>{item.label}</div>;
        }

        const halfStar = Math.round(item.rating * 2) % 2 === 1;
        const fullStars = Math.floor(item.rating);
        const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
        return (
          <Tooltip
            title={
              <Container alignItems="center">
                {range(fullStars).map((i) => (
                  <StarIcon key={i} />
                ))}
                {halfStar && <StarHalfIcon />}
                {range(emptyStars).map((i) => (
                  <StarEmptyIcon key={i} />
                ))}
                <Spacing dir="x" amount={4} />({item.votes})
              </Container>
            }
            position="right"
          >
            <div>{item.label}</div>
          </Tooltip>
        );
      }}
    ></Search>
  );
};

const SEARCH_UG_TABS = gql`
  query SearchUgTabs($query: String!) {
    searchUgTabs(query: $query) {
      trackTitle
      trackArtist
      url
      votes
      rating
      version
    }
  }
`;

const SEARCH_TABS = gql`
  query SearchTabs($query: String!) {
    searchTabs(query: $query) {
      id
      trackTitle
      artist {
        id
        name
      }
    }
  }
`;
