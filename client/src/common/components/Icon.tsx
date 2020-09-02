import { h } from 'preact';
import styled from 'styled-components';

interface SvgProps {
  fill?: string;
  size?: number | string;
  width?: number | string;
  height?: number | string;
}

export const Icon = ({
  icon,
  size,
  width,
  height,
  ...rest
}: { icon: string } & SvgProps) => {
  const dimensions = size ? { width: size, height: size } : { width, height };
  return (
    <Svg
      src={`assets/icons/${icon}.svg`}
      style={{ ...dimensions }}
      {...rest}
    ></Svg>
  );
};

const Svg = styled.div<{ src: string; fill?: string }>`
  mask: url(${props => props.src});
  mask-repeat: no-repeat;
  mask-size: cover;
  background-color: ${props => props.fill ?? 'black'};
  width: 32px;
  height: 32px;
`;
