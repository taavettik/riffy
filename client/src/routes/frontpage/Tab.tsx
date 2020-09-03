import { Container } from '../../common/components/Container';
import { h } from 'preact';
import { useState } from 'react';
import { theme } from '../../common/theme';
import { Icon } from '../../common/components/Icon';
import styled from 'styled-components';
import { useCallback, useEffect } from 'preact/hooks';
import { useTimer } from '../../common/hooks';

export const Tab = () => {
  const text = `Freud Marx Engels & Jung - Tämä kala pääsi karkuun`;
  const [hover, setHover] = useState(false);

  const [textOffset, setTextOffset] = useState(0);

  const timerCallback = useCallback(() => {
    if (!hover) {
      return;
    }
    setTextOffset((offset) => offset + 1);
  }, [hover]);

  useEffect(() => {
    if (!hover) {
      setTextOffset(0);
    }
  }, [hover]);

  useTimer(50, timerCallback);

  return (
    <Container
      borderRadius={theme.borderRadius}
      background="white"
      padding={16}
      flexDirection={'column'}
      border={`1px solid ${theme.colors.gray.light}`}
      width={128}
    >
      <Container>
        <Icon size={128} icon="audiotrack" />
      </Container>
      <TextContainer
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        height={20}
        fontSize={13}
      >
        <Text left={-textOffset}>{text}</Text>
      </TextContainer>
    </Container>
  );
};

const Text = styled.span<{ left: number }>`
  position: relative;
  left: ${(props) => props.left}px;
`;

const TextContainer = styled(Container)`
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  position: relative;
`;
