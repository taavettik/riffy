const chords = [
  'E',
  'F',
  'F#',
  'G',
  'G#',
  'A',
  'A#',
  ['B', 'H'],
  'C',
  'C#',
  'D',
  'D#',
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

export function transposeChord(chord: string, steps: number) {
  const matchingChords = chords.filter((c) => {
    const comparison = chord.slice(0, c.length).toLocaleUpperCase();
    if (Array.isArray(c)) {
      return c.some((version) => version === comparison);
    }
    return comparison === c;
  });

  // Find the longest chord, e.g. C# instead of C
  const match = matchingChords.reduce((longest, chord) =>
    chord.length > longest.length ? chord : longest,
  );

  // Yes, yes, the entire thing could be a reducer
  // but why though
  const index = chords.indexOf(match);

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
        return str + cur.slice(diff);
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

const row = 'A#    F';
const trans = transposeChordRow(row, 1);
console.log(`${row}\n${trans}`, row.length, trans.length);
