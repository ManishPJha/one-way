import React from "react";
import { Spinner as Loader } from "@chakra-ui/react";

interface SpinnerProps {
  thickness?: any;
  speed?: any;
  emptyColor?: any;
  color?: any;
  size?: any;
  className?: string;
}

const Spinner = ({
  thickness,
  speed,
  size,
  color,
  emptyColor,
  className,
}: SpinnerProps) => {
  return (
    <Loader
      thickness={thickness}
      speed={speed}
      emptyColor={emptyColor}
      color={color}
      size={size}
      className={className}
    />
  );
};

export default Spinner;
