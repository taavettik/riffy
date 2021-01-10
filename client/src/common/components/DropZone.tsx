import { ComponentChildren, h } from 'preact';
import { useState } from 'preact/hooks';
import styled from 'styled-components';
import { AddIcon } from '../icons';

interface FileData {
  name: string;
  content: string;
  file: File;
}

export const DropZone = ({
  children,
  onDrop,
}: {
  children: ComponentChildren;
  onDrop: (files: FileData[]) => void;
}) => {
  const [hover, setHover] = useState(false);

  const onDropHandler = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setHover(false);
    const files: File[] = [];
    for (let i = 0; i < e.dataTransfer.files.length; i++) {
      const file = e.dataTransfer.files[i];
      files.push(file);
    }

    const fileData = await Promise.all(
      files.map(async (f) => {
        const content = await f.text();
        return {
          name: f.name,
          content,
          file: f,
        };
      }),
    );

    onDrop(fileData);
  };

  return (
    <DropZoneContainer onDragEnter={() => setHover(true)}>
      {children}
      <DropTarget
        visible={hover}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => onDropHandler(e)}
        onDragLeave={() => setHover(false)}
      >
        <AddIcon size={128} />
      </DropTarget>
    </DropZoneContainer>
  );
};

const DropZoneContainer = styled.div`
  position: relative;
  z-index: 2;
`;

const DropTarget = styled.div<{ visible: boolean }>`
  position: absolute;
  left: -16px;
  top: -16px;
  z-index: 1;
  width: Calc(100% + 32px);
  height: calc(100% + 32px);
  background-color: rgba(255, 255, 255, 0.8);
  border: 2px solid ${(p) => p.theme.colors.primary.main};
  border-radius: ${(p) => p.theme.borderRadius};
  color: ${(p) => p.theme.colors.primary.main};
  display: flex;
  align-items: center;
  justify-content: center;
  ${(p) => !p.visible && `visibility: hidden;`};

  * {
    pointer-events: none;
  }
`;
