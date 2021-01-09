import { Search } from '../../common/components/Search';
import { h } from 'preact';
import { useState } from 'preact/hooks';
import { useHistory } from 'react-router';

const UG_REGEX = /^https:\/\/tabs\.ultimate-guitar\.com/g;

export const SongSearch = () => {
  const [value, setValue] = useState('');

  const ugOption = value.match(UG_REGEX)
    ? {
        id: value,
        label: `UG: ${value.replace(UG_REGEX, '')}`,
      }
    : undefined;

  const options = [ugOption].filter(Boolean) as { id: string; label: string }[];

  const history = useHistory();

  return (
    <Search
      items={options}
      value={value}
      onChange={(value) => setValue(value)}
      onSelect={(item) => {
        history.push(`/ug/${encodeURIComponent(item.id)}`);
      }}
      width={300}
    ></Search>
  );
};
