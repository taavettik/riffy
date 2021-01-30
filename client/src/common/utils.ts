const chords = [
  'E',
  'F',
  'F#',
  'G',
  'G#',
  'A',
  'A#',
  ['B', 'C'],
  'C',
  'C#',
  'D',
  'D#',
];

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
