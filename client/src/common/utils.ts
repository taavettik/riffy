const chords = [
  'E',
  'F',
  ['F#', 'Gb'],
  'G',
  ['G#', 'Ab'],
  'A',
  ['A#', 'Bb'],
  ['B', 'H'],
  'C',
  ['C#', 'Db'],
  'D',
  ['D#', 'Eb'],
];

export function range(num: number) {
  const arr: number[] = [];
  for (let i = 0; i < num; i++) {
    arr.push(i + 1);
  }
  return arr;
}

export function cap(index: number): number {
  if (index < 0) {
    return cap(chords.length + index);
  }
  return index % chords.length;
}

/**
 * Returns the chord in `chord`-param that matches the first parameter,
 * or undefined if no match is found
 *
 * @example
 *
 * getMatch('A', 'A')
 * // -> 'A'
 *
 * getMatch('A', ['H', 'B'])
 * // -> undefined
 *
 * getMatch('H', ['H', 'B'])
 * // -> 'H'
 */
function getMatch(comparison: string, chord: string | string[]) {
  if (Array.isArray(chord)) {
    return chord.find(
      (version) =>
        version.toLocaleUpperCase() === comparison.toLocaleUpperCase(),
    );
  }
  return comparison.slice(0, chord.length).toLocaleUpperCase() === chord
    ? chord
    : undefined;
}

export function transposeChord(chord: string, steps: number) {
  const matchingChords = chords
    .map((c, index) => ({ match: getMatch(chord, c), index }))
    .filter((c) => c.match) as {
    match: string;
    index: number;
  }[];

  if (matchingChords.length === 0) {
    return chord;
  }

  // Find the longest chord, e.g. C# instead of C
  const { match, index } = matchingChords.reduce((longest, chord) =>
    chord.match.length > longest.match.length ? chord : longest,
  );

  // Yes, yes, the entire thing could be a reducer
  // but why though
  const newIndex = cap(index + steps);
  const newChord = chords[newIndex];

  return `${Array.isArray(newChord) ? newChord[0] : newChord}${chord.slice(
    match.length,
  )}`;
}

export function transposeChordRow(row: string, steps: number) {
  const words = row.split(/(\s+)/g);
  const transposed = words.map((word) =>
    word.trim() === '' ? undefined : transposeChord(word, steps),
  );
  const str = words.reduce((str, cur, i) => {
    const prev = words[i - 1] as string | undefined;
    const prevTransposed = transposed[i - 1];
    if (cur.trim() === '') {
      if (!prevTransposed || !prev) {
        return str + cur;
      }
      const diff = prevTransposed.length - prev.length;
      if (diff > 0) {
        const rest = cur.slice(diff);
        return str + (rest.length === 0 ? ' ' : rest);
      } else {
        const spaces = range(Math.abs(diff))
          .map(() => ' ')
          .join('');
        return `${str}${spaces}${cur}`;
      }
    }
    return str + (transposed[i] ?? '');
  }, '');
  return str;
}

// eslint-disable-next-line @typescript-eslint/no-empty-function
export function noop() {}
