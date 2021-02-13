import { Search } from '../../common/components/Search';
import { h } from 'preact';
import { useState } from 'preact/hooks';
import { useHistory } from 'react-router';
import { gql, useLazyQuery, useMutation } from '@apollo/client';
import {
  SearchUgTabs,
  SearchUgTabsVariables,
} from '../../generated/SearchUgTabs';
import { Tooltip } from '../../common/components/Tooltip';
import { range } from '../../common/utils';
import { StarIcon, StarHalfIcon, StarEmptyIcon } from '../../common/icons';
import { Container } from '../../common/components/Container';
import { Spacing } from '../../common/components/Spacing';

const UG_REGEX = /^https:\/\/tabs\.ultimate-guitar\.com/g;

export const SongSearch = () => {
  const [value, setValue] = useState('');

  const ugOption = value.match(UG_REGEX)
    ? {
        id: value,
        label: `UG: ${value.replace(UG_REGEX, '')}`,
      }
    : undefined;

  const [search, { data }] = useLazyQuery<SearchUgTabs, SearchUgTabsVariables>(
    SEARCH_UG_TABS,
    {
      fetchPolicy: 'no-cache',
    },
  );

  const options = [
    ...(data?.searchUgTabs.map((tab) => ({
      id: tab.url,
      label: `${tab.trackArtist} - ${tab.trackTitle} (ver ${tab.version})`,
      rating: tab.rating,
      votes: tab.votes,
    })) ?? []),
    ugOption,
  ].filter(Boolean) as {
    id: string;
    label: string;
    rating: number;
    votes: number;
  }[];

  const history = useHistory();

  const executeSearch = () => {
    search({ variables: { query: value } });
  };

  return (
    <Search
      items={options}
      value={value}
      onChange={(value) => setValue(value)}
      onSelect={(item) => {
        history.push(`/ug/${encodeURIComponent(item.id)}`);
      }}
      width={300}
      inputProps={{
        onKeyDown: (e) => {
          if (e.key === 'Enter') {
            executeSearch();
          }
        },
      }}
      renderItem={(item) => {
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
