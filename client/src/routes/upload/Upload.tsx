import { gql, useMutation, useQuery } from '@apollo/client';
import { h } from 'preact';
import { useEffect, useRef, useState } from 'preact/hooks';
import { useHistory, useLocation } from 'react-router';
import styled from 'styled-components';
import { Button } from '../../common/components/Button';
import { Container } from '../../common/components/Container';
import { FileData } from '../../common/components/DropZone';
import { Input, TextArea } from '../../common/components/Input';
import { Page } from '../../common/components/Page';
import { Spacing } from '../../common/components/Spacing';
import { Tooltip } from '../../common/components/Tooltip';
import { Body, Label } from '../../common/components/Typography';
import { GET_CONFLICTING_TABS } from '../../common/queries';
import { theme } from '../../common/theme';
import { CreateTabs, CreateTabsVariables } from '../../generated/CreateTabs';
import {
  GetConflictingTabs,
  GetConflictingTabsVariables,
} from '../../generated/GetConflictingTabs';
import { TabData } from '../../generated/globalTypes';

export const Upload = () => {
  const { state } = useLocation<{ tabs: TabData[] }>();

  const [tabs, setTabs] = useState<TabData[]>([]);

  const [selected, setSelected] = useState(0);

  const textAreaRef = useRef<HTMLTextAreaElement>();

  const history = useHistory();

  const [createTabs] = useMutation<CreateTabs, CreateTabsVariables>(
    CREATE_TABS,
    {
      variables: {
        tabs,
      },
      onCompleted: () => {
        history.goBack();
      },
      refetchQueries: ['GetTabs'],
    },
  );

  useEffect(() => {
    if (!state?.tabs) {
      return;
    }
    setTabs(state.tabs);
  }, [state?.tabs]);

  const onTabChange = (tab: TabData, index: number) =>
    setTabs((tabs) => tabs.map((t, i) => (index === i ? tab : t)));

  const selectedTab = tabs[selected] as TabData | undefined;

  useEffect(() => {
    if (!selectedTab || !textAreaRef.current) {
      return;
    }
    textAreaRef.current.value = selectedTab.chords;
  }, [selected]);

  const onSubmit = () => {
    createTabs();
  };

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
            <Button onClick={() => onSubmit()} width={200}>
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
  tab: TabData;
  selected: boolean;
  onChange: (tab: TabData) => void;
  onFocus: () => void;
}) => {
  const { data: conflicts } = useQuery<
    GetConflictingTabs,
    GetConflictingTabsVariables
  >(GET_CONFLICTING_TABS, {
    variables: {
      title: tab.trackTitle,
      artist: tab.trackArtist,
    },
  });

  const conflictCount = conflicts?.getConflictingTabs.length ?? 0;
  const hasConflict = conflictCount > 0;

  return (
    <RowContainer
      selected={selected}
      conflict={hasConflict}
      onClick={() => onFocus()}
    >
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
        {hasConflict ? (
          <TooltipContainer>
            <Tooltip
              title={
                <span>
                  A tab with this name already exists.
                  <br />
                  The contents will be overridden
                </span>
              }
              position="right"
              offset={{ left: 8 }}
            >
              <Label
                color={conflictCount > 0 ? theme.colors.error.main : undefined}
              >
                Title
              </Label>
            </Tooltip>
          </TooltipContainer>
        ) : (
          <Label>Title</Label>
        )}

        <Input
          onFocus={() => onFocus()}
          onChange={(e) => onChange({ ...tab, trackTitle: e.target.value })}
          value={tab.trackTitle}
        />
      </Container>
    </RowContainer>
  );
};

const TooltipContainer = styled.div`
  width: fit-content;
`;

const RowContainer = styled(Container)<{
  selected: boolean;
  conflict?: boolean;
}>`
  border-left: 2px solid ${(p) => p.theme.colors.gray.main};
  ${(p) =>
    p.selected
      ? `
  border-color: ${p.theme.colors.primary.main};
  border-width: 4px;
  `
      : ''}
  ${(p) =>
    p.conflict
      ? `border-color: ${p.theme.colors.error.main};`
      : ''}
  padding: 16px;
`;

const CREATE_TABS = gql`
  mutation CreateTabs($tabs: [TabData!]!) {
    createTabs(tabs: $tabs) {
      id
      artist {
        id
        tabs {
          id
        }
      }
    }
  }
`;
