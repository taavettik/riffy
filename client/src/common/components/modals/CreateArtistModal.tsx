import { h } from 'preact';
import { useEffect, useState } from 'preact/hooks';
import { Button } from '../Button';
import { Container } from '../Container';
import { Modal } from '../Modal';
import { MusicSearch } from '../MusicSearch';
import { Item } from '../Search';
import { Spacing } from '../Spacing';
import { Body, Subheading } from '../Typography';

export const CreateArtistModal = ({
  open,
  onClose,
  onContinue,
}: {
  open: boolean;
  onClose: () => void;
  onContinue?: (artist: string) => void;
}) => {
  const [artist, setArtist] = useState<Item>({ id: '', label: '' });

  useEffect(() => {
    if (!open) {
      return;
    }
    setArtist({ id: '', label: '' });
  }, [open]);

  return (
    <Modal width={400} open={open}>
      <Container justifyContent="flex-end">
        <Subheading fontSize={24}>Create artist</Subheading>
      </Container>

      <Spacing dir="y" amount={16} />

      <MusicSearch
        type="artist"
        value={artist}
        onChange={(artist) => setArtist({ id: '', label: artist })}
        onSelect={(item) => setArtist(item)}
      />

      <Spacing dir="y" amount={16} />

      <Container justifyContent="flex-end">
        <Button onClick={() => onClose()}>
          <Body>Cancel</Body>
        </Button>

        <Spacing dir="x" amount={16} />

        <Button
          onClick={() => {
            if (onContinue) onContinue(artist.label);
            onClose();
          }}
        >
          <Body>Continue</Body>
        </Button>
      </Container>
    </Modal>
  );
};
