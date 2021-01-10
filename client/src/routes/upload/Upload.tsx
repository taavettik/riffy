import { h } from 'preact';
import { useEffect, useRef, useState } from 'preact/hooks';
import { useLocation } from 'react-router';
import styled from 'styled-components';
import { Button } from '../../common/components/Button';
import { Container } from '../../common/components/Container';
import { FileData } from '../../common/components/DropZone';
import { Input, TextArea } from '../../common/components/Input';
import { Page } from '../../common/components/Page';
import { Spacing } from '../../common/components/Spacing';
import { Body, Label } from '../../common/components/Typography';

interface Tab {
  chords: string;
  trackArtist: string;
  trackTitle: string;
}

export const Upload = () => {
  const { state } = useLocation<{ tabs: Tab[] }>();

  const [tabs, setTabs] = useState<Tab[]>([]);

  const [selected, setSelected] = useState(0);

  const textAreaRef = useRef<HTMLTextAreaElement>();

  useEffect(() => {
    if (!state?.tabs) {
      return;
    }
    setTabs(state.tabs);
  }, [state?.tabs]);

  const onTabChange = (tab: Tab, index: number) =>
    setTabs((tabs) => tabs.map((t, i) => (index === i ? tab : t)));

  const selectedTab = tabs[selected] as Tab | undefined;

  useEffect(() => {
    if (!selectedTab || !textAreaRef.current) {
      return;
    }
    textAreaRef.current.value = selectedTab.chords;
  }, [selected]);

  const onSubmit = () => {};

  return (
    <Page title="Upload tabs" showBackButton>
      <Container width={'100%'} height={'100%'}>
        <Container flex={1} flexDirection="column">
          <Container overflow={'auto'} flex={1} flexDirection="column">
            {tabs.map((tab, i) => (
              <>
                <TabRow
                  selected={selected === i}
                  tab={tab}
                  onFocus={() => setSelected(i)}
                  onChange={(tab) => onTabChange(tab, i)}
                  key={i}
                />
              </>
            ))}
          </Container>

          <Spacing dir="y" amount={16} />

          <Container justifyContent="center">
            <Button width={200}>
              <Body>Submit</Body>
            </Button>
          </Container>
        </Container>

        <Spacing dir="x" amount={16} />

        <Container flex={1}>
          <TextArea
            ref={textAreaRef as any}
            width="100%"
            onChange={(e) =>
              selectedTab &&
              onTabChange(
                {
                  ...selectedTab,
                  chords: e.target.value,
                },
                selected,
              )
            }
            resize="none"
          >
            {selectedTab?.chords}
          </TextArea>
        </Container>
      </Container>

      <Spacing dir="y" amount={32} />
    </Page>
  );
};

const TabRow = ({
  tab,
  selected,
  onChange,
  onFocus,
}: {
  tab: Tab;
  selected: boolean;
  onChange: (tab: Tab) => void;
  onFocus: () => void;
}) => {
  return (
    <RowContainer selected={selected} onClick={() => onFocus()}>
      <Container flex={1} flexDirection="column">
        <Label>Artist</Label>

        <Input
          onFocus={() => onFocus()}
          onChange={(e) => onChange({ ...tab, trackArtist: e.target.value })}
          value={tab.trackArtist}
        />
      </Container>

      <Spacing dir="x" amount={16} />

      <Container flex={1} flexDirection="column">
        <Label>Title</Label>

        <Input
          onFocus={() => onFocus()}
          onChange={(e) => onChange({ ...tab, trackTitle: e.target.value })}
          value={tab.trackTitle}
        />
      </Container>
    </RowContainer>
  );
};

const RowContainer = styled(Container)<{ selected: boolean }>`
  border-left: 2px solid ${(p) => p.theme.colors.gray.main};
  ${(p) =>
    p.selected &&
    `
  border-color: ${p.theme.colors.primary.main};
  border-width: 4px;
  `}
  padding: 16px;
`;
