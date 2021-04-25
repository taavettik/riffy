import { ComponentChildren, h } from 'preact';
import { useState } from 'preact/hooks';
import styled from 'styled-components';
import chardet from 'jschardet';
import { AddIcon } from '../icons';
import { gql, useApolloClient, useLazyQuery } from '@apollo/client';
import {
  DetectEncoding,
  DetectEncodingVariables,
} from '../../generated/DetectEncoding';
import { Container, ContainerProps } from './Container';

export interface FileData {
  name: string;
  content: string;
  file: File;
}

export const DropZone = ({
  children,
  onDrop,
  ...props
}: {
  children: ComponentChildren;
  onDrop: (files: FileData[]) => void;
} & ContainerProps) => {
  const [hover, setHover] = useState(false);

  const client = useApolloClient();

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
        // Detect file encoding and read contents properly
        const buffer = await f.arrayBuffer();
        const arr = new Uint8Array(buffer);
        let string = '';
        for (let i = 0; i < arr.length; i++) {
          string += String.fromCharCode(arr[i]);
        }

        const encoding = await client.query<
          DetectEncoding,
          DetectEncodingVariables
        >({
          query: DETECT_ENCODING,
          variables: {
            data: btoa(string),
          },
        });

        const decoder = new TextDecoder(
          encoding.data?.detectEncoding ?? 'UTF-8',
        );

        return {
          name: f.name,
          content: decoder.decode(buffer),
          file: f,
        };
      }),
    );

    onDrop(fileData);
  };

  return (
    <DropZoneContainer {...props} onDragEnter={() => setHover(true)}>
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

const CONVERT_TEXT_QUERY = gql`
  query ConvertToEncoding($data: String!, $encoding: String!) {
    convertToEncoding(data: $data, encoding: $encoding)
  }
`;

const DETECT_ENCODING = gql`
  query DetectEncoding($data: String!) {
    detectEncoding(data: $data)
  }
`;

const DropZoneContainer = styled(Container)`
  position: relative;
  height: 100%;
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
