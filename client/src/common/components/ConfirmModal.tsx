import { h } from 'preact';
import { Button } from './Button';
import { Container } from './Container';
import { Modal } from './Modal';
import { Spacing } from './Spacing';
import { Body, Label, Subheading } from './Typography';

export const ConfirmModal = ({
  open,
  onClose,
  onConfirm,
}: {
  open: boolean;
  onClose?: () => void;
  onConfirm?: () => void;
}) => {
  if (!open) {
    return null;
  }

  return (
    <Modal open={open} width={300}>
      <Container justifyContent="flex-end">
        <Subheading fontSize={24}>Are you sure?</Subheading>
      </Container>

      <Spacing dir="y" amount={16} />

      <Container flexDirection="row" justifyContent="flex-end">
        <Button
          onClick={() => {
            if (onConfirm) {
              onConfirm();
            } else if (onClose) {
              onClose();
            }
          }}
        >
          <Body>Ok</Body>
        </Button>

        <Spacing dir="x" amount={16} />

        <Button onClick={() => onClose && onClose()}>
          <Body>Cancel</Body>
        </Button>
      </Container>
    </Modal>
  );
};
