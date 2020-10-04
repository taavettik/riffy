import { Input } from './Input';
import { h } from 'preact';
import { useState } from 'preact/hooks';
import {
  Combobox,
  ComboboxInput,
  ComboboxPopover,
  ComboboxList,
  ComboboxOption,
  ComboboxOptionText,
} from '@reach/combobox';
import styled from 'styled-components';
import { Body } from './Typography';
import { Container } from './Container';

interface Item {
  id: string;
  label: string;
}

export const Search = ({
  items,
  onChange,
  onSelect,
  value,
}: {
  items: string[];
  onChange?: (value: string) => void;
  onSelect?: (value: string) => void;
  value?: string;
}) => {
  return (
    <Combobox
      style={{
        display: 'flex',
      }}
      onSelect={onSelect}
    >
      <ComboboxInput
        as={Input}
        value={value}
        onChange={(e: any) => onChange && onChange(e.target.value)}
        style={{ width: '100%' }}
      />
      <Popover>
        {items.length === 0 && (
          <Container paddingLeft="8px">
            <Body>No suggestions found</Body>
          </Container>
        )}
        <List>
          {items.map((item, i) => (
            <Option key={i} value={item} />
          ))}
        </List>
      </Popover>
    </Combobox>
  );
};

const Popover = styled(ComboboxPopover)`
  background-color: white;
  border: 1px solid ${(props) => props.theme.colors.gray.main};
`;

const List = styled(ComboboxList)`
  list-style-type: none;
  padding: 0;
  margin: 0;
`;

const Option = styled(ComboboxOption)`
  padding-left: 8px;
  cursor: pointer;
  :focus,
  :active,
  &[aria-selected='true'],
  :hover {
    background-color: ${(props) => props.theme.colors.primary.lightest};
  }
`;
