import { createPortal } from 'preact/compat';
import styled from 'styled-components';
import { ComponentChildren, h } from 'preact';
import { layout, LayoutProps } from 'styled-system';

export const Modal = ({
  open,
  children,
  ...props
}: {
  open: boolean;
  children: ComponentChildren;
} & LayoutProps) => {
  if (!open) {
    return null;
  }
  return createPortal(
    <ModalBackground>
      <ModalContainer {...props}>{children}</ModalContainer>
    </ModalBackground>,
    document.body,
  );
};

const ModalBackground = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.5);
  z-index: 10;
`;

const ModalContainer = styled.div<LayoutProps>`
  width: 1000px;
  background-color: white;
  padding: 24px 32px 16px 32px;
  border-radius: ${(p) => p.theme.borderRadius};
  border: 1px solid ${(p) => p.theme.colors.gray.main};
  display: flex;
  flex-direction: column;
  ${layout}
`;
