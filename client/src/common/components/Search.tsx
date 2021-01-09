import { Input } from './Input';
import { ComponentProps, h } from 'preact';
import { useEffect, useRef, useState } from 'preact/hooks';
import styled from 'styled-components';
import { Body } from './Typography';
import { Container } from './Container';
import { LayoutProps } from 'styled-system';

export interface Item {
  id: string;
  label: string;
}

// TODO: accessibility

export const Search = <I extends Item>({
  items,
  onChange,
  onSelect,
  value,
  ...props
}: LayoutProps & {
  items: I[];
  onChange: (value: string) => void;
  onSelect?: (item: I) => void;
  value: string;
}) => {
  const inputRef = useRef<HTMLInputElement>();
  const anchorRef = useRef<HTMLDivElement>();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    function clickListener(e: MouseEvent) {
      const clicked = e.target;
      if (
        !anchorRef.current ||
        !inputRef.current ||
        !clicked ||
        !(clicked instanceof HTMLElement)
      ) {
        return;
      }
      if (
        !inputRef.current.contains(clicked) &&
        !anchorRef.current.contains(clicked)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener('click', clickListener);
    return () => document.removeEventListener('click', clickListener);
  }, [anchorRef, inputRef]);

  const onItemSelect = (id: string) => {
    const item = items.find((item) => item.id === id);
    if (!item) {
      return;
    }
    if (onSelect) {
      onSelect(item);
    } else {
      onChange(item.label);
    }
    setOpen(false);
  };

  return (
    <Container flexDirection="column">
      <Input
        ref={inputRef}
        value={value}
        onChange={(e) => {
          if (onChange) {
            onChange(e.target.value);
          }
          setOpen(true);
        }}
        {...props}
      />
      <Anchor ref={anchorRef}>
        {open && (
          <Popover>
            <List>
              {items.length === 0 && (
                <Container paddingLeft="8px">
                  <Body>No results found</Body>
                </Container>
              )}
              {items.map((item, i) => (
                <Option key={i} onClick={() => onItemSelect(item.id)}>
                  {item.label}
                </Option>
              ))}
            </List>
          </Popover>
        )}
      </Anchor>
    </Container>
  );
};

const Popover = styled.div`
  position: absolute;
  background-color: white;
  width: 100%;
  border: 1px solid ${(props) => props.theme.colors.gray.main};
  z-index: 100;
`;

const Anchor = styled.div`
  position: relative;
  width: 100%;
  height: 0;
`;

const List = styled.ul`
  list-style-type: none;
  padding: 0;
  margin: 0;
`;

const Option = styled.li`
  word-break: break-all;
  padding-left: 8px;
  cursor: pointer;
  :focus,
  :active,
  &[aria-selected='true'],
  :hover {
    background-color: ${(props) => props.theme.colors.primary.lightest};
  }
`;
