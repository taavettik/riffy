import { h } from 'preact';

export const Spacing = ({
  dir,
  amount,
}: {
  dir: 'x' | 'y';
  amount: number | string;
}) => {
  return (
    <div
      style={{
        [dir === 'x' ? 'width' : 'height']: amount,
      }}
    />
  );
};
