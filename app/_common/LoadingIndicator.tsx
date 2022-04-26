import styled, { keyframes } from "styled-components";

const Position = styled.div`
  position: relative;
`;

const BackgroundSvgContainer = styled.span<{ size: string | number }>`
  width: ${(props) =>
    typeof props.size === "number" ? `${props.size}px` : props.size};
  height: ${(props) =>
    typeof props.size === "number" ? `${props.size}px` : props.size};
  transform: rotate(-90deg);
  display: inline-block;
  transition: transform 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
  color: #eeeeee;
`;

const loading = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

const ForegroundSvgContainer = styled.span<{ size: string | number }>`
  width: ${(props) =>
    typeof props.size === "number" ? `${props.size}px` : props.size};
  height: ${(props) =>
    typeof props.size === "number" ? `${props.size}px` : props.size};
  display: inline-block;
  animation: 550ms linear 0s infinite normal none running ${loading};
  color: #1a90ff;
  position: absolute;
  left: 0;
`;

// Inspired by the former Facebook spinners.
export function LoadingIndicator({
  size = 40,
  thickness = 4,
}: {
  size?: string | number;
  thickness?: number;
}) {
  return (
    <Position>
      <BackgroundSvgContainer
        role="progressbar"
        aria-valuenow={100}
        size={size}
      >
        <svg viewBox="22 22 44 44">
          <circle
            cx={44}
            cy={44}
            r="20.5"
            fill="none"
            strokeWidth={thickness}
            style={{
              strokeDasharray: "128.805",
              strokeDashoffset: 0,
              stroke: "currentcolor",
              transition:
                "stroke-dashoffset 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
            }}
          />
        </svg>
      </BackgroundSvgContainer>
      <ForegroundSvgContainer size={size}>
        <svg viewBox="22 22 44 44">
          <circle
            cx="44"
            cy="44"
            r="20.5"
            fill="none"
            strokeWidth={thickness}
            style={{
              stroke: "currentcolor",
              strokeDasharray: "80px, 200px",
              strokeDashoffset: 0,
            }}
          ></circle>
        </svg>
      </ForegroundSvgContainer>
    </Position>
  );
}
