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
  disabled?: boolean;
}

// TODO: accessibility

export const Search = <I extends Item>({
  items,
  onChange,
  onSelect,
  value,
  inputProps,
  renderItem,
  ...props
}: LayoutProps & {
  items: I[];
  onChange: (value: string) => void;
  onSelect?: (item: I, setCancelled: (target: boolean) => void) => void;
  value: string;
  inputProps?: React.HTMLAttributes<HTMLInputElement>;
  placeholder?: string;
  renderItem?: (item: I) => JSX.Element | string;
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
    let close = false;
    if (onSelect) {
      onSelect(item, (target) => (close = target));
    } else {
      onChange(item.label);
    }
    setOpen(close);
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
        {...(inputProps as any)}
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
              {items.map((item, i) =>
                item.disabled ? (
                  <Container paddingLeft="8px">
                    {renderItem ? renderItem(item) : item.label}
                  </Container>
                ) : (
                  <Option key={i} onClick={() => onItemSelect(item.id)}>
                    {renderItem ? renderItem(item) : item.label}
                  </Option>
                ),
              )}
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
