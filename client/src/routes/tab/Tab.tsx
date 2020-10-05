import { Page } from '../../common/components/Page';
import { h } from 'preact';
import { useParams } from 'react-router';
import { gql, useQuery } from '@apollo/client';
import { GetTab, GetTabVariables } from '../../generated/GetTab';
import { Container } from '../../common/components/Container';
import styled from 'styled-components';

type ChordRow =
  | {
      type: 'chords';
      text: string;
    }
  | {
      type: 'lyrics';
      text: string;
    }
  | {
      type: 'separator';
    };

function parseChords(raw: string): ChordRow[] {
  const rows = raw.split(/\n/g);
  const parsed = rows.map((row) => {
    const words = row.split(/\s+/g).filter((row) => row.trim() !== '');
    const chords = words.map((word) =>
      word.toLocaleLowerCase().match(/^([abcdefgh]#?m?)$/g),
    );
    if (row.trim() === '') {
      return {
        type: 'separator',
      } as ChordRow;
    }
    if (chords.every(Boolean) && chords.length > 0) {
      return {
        type: 'chords',
        words,
        text: row,
      } as ChordRow;
    }
    return {
      type: 'lyrics',
      words,
      text: row,
    } as ChordRow;
  });
  return parsed;
}

export const Tab = () => {
  const { id } = useParams<{ id: string }>();

  const { data } = useQuery<GetTab, GetTabVariables>(GET_TAB, {
    variables: {
      id,
    },
  });

  if (!data) {
    return <div></div>;
  }

  const parsed = parseChords(data.getTab.chords);
  /**
   * Chord rows grouped so that chords and corresponding lyrics are in
   * the same block
   */
  const blocks = parsed.reduce((arr, cur, i) => {
    const curChunk = arr.slice(-1)[0];
    if (cur.type === 'lyrics' && curChunk?.slice(-1)[0]?.type === 'chords') {
      return [...arr.slice(0, -1), [...curChunk, cur]];
    }
    return [...arr, [cur]];
  }, [] as ChordRow[][]);

  return (
    <Page title={`${data.getTab.trackArtist} - ${data.getTab.trackTitle}`}>
      <ChordsContainer>
        {blocks.map((block, i) =>
          block[0].type === 'separator' ? (
            <Separator />
          ) : (
            <Row>
              {block.map((b) => ('text' in b ? b.text : '')).join('\n')}
            </Row>
          ),
        )}
      </ChordsContainer>
    </Page>
  );
};

const ChordsContainer = styled(Container)`
  white-space: pre-wrap;
  font-family: monospace;
  flex-direction: column;
  overflow: auto;
  max-height: Calc(100vh - 200px);
  width: 100%;
  flex-wrap: wrap;
`;

const Row = styled.span`
  white-space: pre;
  margin-right: 16px;
  border-right: 1px solid ${(props) => props.theme.colors.gray.main};
`;

const Separator = styled(Row)`
  min-height: 24px;
  height: 24px;
`;

const GET_TAB = gql`
  query GetTab($id: String!) {
    getTab(id: $id) {
      id
      chords
      trackTitle
      trackArtist
    }
  }
`;
