import { h, Fragment } from 'preact';
import { createPortal } from 'preact/compat';
import { useEffect, useRef, useState } from 'preact/hooks';
import React from 'react';
import styled from 'styled-components';

/**
 * Get the index of the `HTMLElement` `el` in it's parent's children
 */
function getElementIndex(el: HTMLElement) {
  const parent = el.parentElement;
  if (!parent) {
    return -1;
  }
  const children = Array.from(parent.children);
  return children.findIndex((child) => child === el);
}

interface Offset {
  top?: number;
  bottom?: number;
  left?: number;
  right?: number;
}

type Position = 'left' | 'right' | 'top' | 'bottom';

interface Props {
  children: JSX.Element;
  title: JSX.Element | string;
  position?: Position;
  offset?: Offset;
}

export const Tooltip = ({
  children,
  title,
  position = 'bottom',
  offset,
}: Props) => {
  const ref = useRef<HTMLDivElement | null>(null);

  const [visible, setVisible] = useState(false);
  const [right, setRight] = useState(0);
  const [left, setLeft] = useState(0);
  const [top, setTop] = useState(0);
  const [bottom, setBottom] = useState(0);

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (!ref.current) {
        return;
      }
      const index = getElementIndex(ref.current);
      if (index === -1 || !ref.current.parentElement) {
        return;
      }
      const nextChild = ref.current.parentElement?.children.item(index + 1);
      if (!nextChild || !(nextChild instanceof HTMLElement)) {
        return;
      }

      const rect = nextChild.getBoundingClientRect();
      const isInside =
        e.clientY > rect.top &&
        e.clientY < rect.top + rect.height &&
        e.clientX > rect.left &&
        e.clientX < rect.left + rect.width;

      if (isInside) {
        if (position === 'right') {
          setLeft(rect.x + rect.width);
          setTop(rect.y);
          setRight(0);
          setBottom(0);
        } else if (position === 'left') {
          setRight(window.innerWidth - rect.x);
          setTop(rect.y);
          setLeft(0);
          setBottom(0);
        } else if (position === 'top') {
          setBottom(window.innerHeight - rect.y);
          setLeft(rect.x);
          setTop(0);
          setRight(0);
        } else if (position === 'bottom') {
          setTop(rect.y + rect.height);
          setLeft(rect.x);
          setRight(0);
          setBottom(0);
        }
      }

      setVisible(isInside);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('wheel', onMouseMove);

    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('wheel', onMouseMove);
    };
  }, []);

  return (
    <>
      <div ref={ref} />
      {children}

      {visible &&
        title &&
        createPortal(
          <TooltipContainer
            style={{
              marginRight: offset?.right,
              marginLeft: offset?.left,
              marginTop: offset?.top,
              marginBottom: offset?.bottom,
            }}
            left={left}
            right={right}
            top={top}
            bottom={bottom}
          >
            {title}
          </TooltipContainer>,
          document.body,
        )}
    </>
  );
};

const TooltipContainer = styled.div<{
  left: number;
  right: number;
  top: number;
  bottom: number;
}>`
  position: fixed;
  ${(props) => (props.left ? `left: ${props.left}px;` : '')}
  ${(props) => (props.right ? `right: ${props.right}px;` : '')}
  ${(props) =>
    props.top ? `top: ${props.top}px;` : ''}
  ${(props) =>
    props.bottom ? `bottom: ${props.bottom}px;` : ''}
  background-color: white;
  border: 1px solid ${(props) => props.theme.colors.gray.main};
  border-radius: ${(props) => props.theme.borderRadius};
  padding: 4px;
  z-index: 1000;
`;
