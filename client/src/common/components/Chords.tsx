import styled from 'styled-components';
import { h } from 'preact';
import { Container } from './Container';

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

export const Chords = ({ chords }: { chords: string }) => {
  const parsed = parseChords(chords);

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
    <ChordsContainer>
      {blocks.map((block, i) =>
        block[0].type === 'separator' ? (
          <Separator />
        ) : (
          <Row>{block.map((b) => ('text' in b ? b.text : '')).join('\n')}</Row>
        ),
      )}
    </ChordsContainer>
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
