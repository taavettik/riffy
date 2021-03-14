import { Search } from '../../common/components/Search';
import { h } from 'preact';
import { useState } from 'preact/hooks';
import { useHistory } from 'react-router';
import { gql, useLazyQuery, useMutation } from '@apollo/client';
import {
  SearchUgTabs,
  SearchUgTabsVariables,
} from '../../generated/SearchUgTabs';

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
    })) ?? []),
    ugOption,
  ].filter(Boolean) as { id: string; label: string }[];

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
      version
    }
  }
`;
