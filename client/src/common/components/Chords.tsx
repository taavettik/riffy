import styled, { StyleSheetManager } from 'styled-components';
import { h } from 'preact';
import { Container } from './Container';
import { cap, noop, transposeChord, transposeChordRow } from '../utils';
import { useState, useEffect, useRef } from 'preact/hooks';
import { Button } from './Button';
import { PlusIcon, MinusIcon } from '../icons';
import { Body, Label } from './Typography';
import { Spacing } from './Spacing';
import { usePopup } from '../hooks/usePopup';
import { createPortal } from 'preact/compat';
import { PopupWindow } from './PopupWindow';
import { useDimensions } from '../hooks';

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

function isChord(word: string) {
  return Boolean(
    word.match(
      /^([ABCDEFGH](?:b|#)?m?(sus)?)[1-9]?(\/([ABCDEFGH](?:b|#)?m?(sus)?)[1-9]?)?$/g,
    ),
  );
}

function parseChords(raw: string): ChordRow[] {
  const rows = raw.split(/\n/g);
  const parsed = rows.map((row) => {
    const words = row.split(/\s+/g).filter((row) => row.trim() !== '');
    const chords = words.map((word) => isChord(word));
    if (row.trim() === '') {
      return {
        type: 'separator',
      } as ChordRow;
    }
    if (chords.some(Boolean) && chords.length > 0) {
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

export const Chords = ({
  chords,
  onTranspose,
  initialTransposition,
  popupOpen = false,
  togglePopup = noop,
}: {
  chords: string;
  onTranspose?: (steps: number) => void;
  initialTransposition?: number;
  popupOpen?: boolean;
  togglePopup?: (target: boolean) => void;
}) => {
  const parsed = parseChords(chords);

  const [transposed, setTransposed] = useState(initialTransposition ?? 0);

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

  useEffect(() => {
    if (!onTranspose) {
      return;
    }
    onTranspose(transposed);
  }, [transposed]);

  const containerRef = useRef<HTMLDivElement>(null);
  const popupWindowRef = useRef<Window>(null);

  const { isMobile } = useDimensions();

  return (
    <OuterContainer>
      <ChordsContainer
        ref={containerRef}
        list={isMobile}
        onWheel={(e) => {
          const container = containerRef.current;
          if (!container) {
            return;
          }
          // check if container has y-scrollbar
          if (container.scrollHeight !== container.clientHeight) {
            return;
          }
          // if not, scroll in x
          container.scrollBy(e.deltaY, 0);
        }}
        maxHeight="Calc(100vh - 200px)"
      >
        {popupOpen && (
          <ChordsOverlay onClick={() => popupWindowRef.current.focus()}>
            <Body width="auto">You have the chords opened in a popup</Body>
          </ChordsOverlay>
        )}

        <ChordContent chordBlocks={blocks} transposed={transposed} />
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

      <PopupWindow
        open={popupOpen}
        onStateChange={(target) => togglePopup(target)}
        windowRef={popupWindowRef}
      >
        <ChordsContainer height="100%">
          <ChordContent chordBlocks={blocks} transposed={transposed} />
        </ChordsContainer>
      </PopupWindow>
    </OuterContainer>
  );
};

/**
 * Renders the supplied parsed chords
 */
const ChordContent = ({
  chordBlocks,
  transposed,
}: {
  chordBlocks: ChordRow[][];
  transposed?: number;
}) => {
  return (
    <>
      {chordBlocks.map((block, i) => {
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
                const chordRow = transposed
                  ? transposeChordRow(row.text, transposed)
                  : row.text;
                const words = chordRow.split(/(\s+)/g);

                return (
                  <span key={`${i}-${j}`}>
                    {words.map((word) => {
                      if (word.length === 0 || word === '\r') {
                        return null;
                      }

                      return word.trim() === '' || !isChord(word) ? (
                        <span>{word}</span>
                      ) : (
                        <Chord>{word}</Chord>
                      );
                    })}
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
    </>
  );
};

const ChordsContainer = styled(Container)<{ list?: boolean }>`
  white-space: pre-wrap;
  flex-direction: column;
  overflow: auto;
  width: 100%;
  position: relative;

  ${(props) =>
    props.list
      ? ``
      : `
    flex-wrap: wrap;
  
    > span {
      border-right: 1px solid ${props.theme.colors.gray.main};
    }
  `}

  span {
    font-family: monospace !important;
  }
`;

const OuterContainer = styled(Container)`
  width: 100%;
  flex-direction: column;

  ${(props) => props.theme.mobile} {
    width: Calc(100vw - 66px);
  }
`;

const ChordsOverlay = styled.button`
  display: flex;
  position: absolute;
  left: -32px;
  top: -32px;
  width: Calc(100% + 32px);
  height: Calc(100% + 32px);
  align-items: center;
  justify-content: center;
  background: #ffffffbb;
  border: none;
  cursor: pointer;

  :focus,
  :hover {
    outline: none;
    background-color: ${(props) => props.theme.colors.primary.lightest}bb;
  }
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
