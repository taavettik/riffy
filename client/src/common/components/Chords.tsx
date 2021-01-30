import styled from 'styled-components';
import { h } from 'preact';
import { Container } from './Container';
import { cap, transposeChord } from '../utils';
import { useState } from 'preact/hooks';
import { Button } from './Button';
import { PlusIcon, MinusIcon } from '../icons';
import { Body, Label } from './Typography';
import { Spacing } from './Spacing';

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
      word
        .toLocaleLowerCase()
        .match(
          /^([abcdefgh]#?m?(sus)?)[1-9]?(\/([abcdefgh]#?m?(sus)?)[1-9]?)?$/g,
        ),
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

  const [transposed, setTransposed] = useState(0);

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
    <Container flexDirection="column" width="100%">
      <ChordsContainer>
        {blocks.map((block, i) => {
          if (block[0].type === 'separator') {
            return <Separator key={i} />;
          }
          return (
            <Row key={i}>
              {block.map((row, j) => {
                if (row.type === 'separator') {
                  return null;
                }
                if (row.type === 'chords') {
                  const words = row.text.split(/(\s+)/g);
                  return (
                    <span key={`${i}-${j}`}>
                      {words.map((word) =>
                        word.trim() === '' ? (
                          <span>{word}</span>
                        ) : (
                          <Chord>
                            {transposed
                              ? transposeChord(word, transposed)
                              : word}
                          </Chord>
                        ),
                      )}
                      <br />
                    </span>
                  );
                }
                return (
                  <span key={`${i}-${j}`}>
                    {row.text}
                    <br />
                  </span>
                );
              })}
              {/*rows.join('\n')*/}
            </Row>
          );
        })}
      </ChordsContainer>

      <ActionsContainer>
        <Container>
          <Container>
            <Label>Tranpose:</Label>
          </Container>

          <Spacing dir="x" amount={16} />

          <ActionButton
            onClick={() => setTransposed((transposed) => transposed + 1)}
          >
            <PlusIcon size={16} />
          </ActionButton>

          <Container width={40} alignItems="center">
            <Body textAlign="center">+{cap(transposed)}</Body>
          </Container>

          <ActionButton
            onClick={() => setTransposed((transposed) => transposed - 1)}
          >
            <MinusIcon size={16} />
          </ActionButton>
        </Container>
      </ActionsContainer>
    </Container>
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

const ActionButton = styled(Button)`
  width: 32px;
  height: 32px;
  padding: 0;
  align-items: center;
`;

const ActionsContainer = styled(Container)`
  border-top: 1px solid ${(props) => props.theme.colors.gray.main};
  padding-top: 16px;
  align-items: center;
  justify-content: flex-end;
`;

const Row = styled.span`
  white-space: pre;
  margin-right: 16px;
  border-right: 1px solid ${(props) => props.theme.colors.gray.main};
`;

const Chord = styled.span`
  background-color: ${(props) => props.theme.colors.gray.light};
  box-shadow: ${(props) =>
    `1px 0px 0px ${props.theme.colors.gray.light}, -1px 0px 0px ${props.theme.colors.gray.light}`};
`;

const Separator = styled(Row)`
  min-height: 24px;
  height: 24px;
`;
