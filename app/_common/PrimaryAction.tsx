import React from 'react'
import styled from 'styled-components'
import { themeProps } from "./Layout";
import { LoadingIndicator } from './LoadingIndicator'

const StyledPrimaryAction = styled.div<props>`
    padding: 8px 20px;
    height: ${(props) => props.height ? props.height : '35px'};
    font-weight: normal;
    overflow: visible;
    white-space: nowrap;
    display: flex;
    width: ${(props) => props.width ? props.width : '80px'};
    justify-content: center;
    align-items: center;
    vertical-align: middle;
    background: ${(props) =>
        props.disabled ? themeProps.palette.color.backgroundColorDarker : themeProps.palette.color.purple};
    box-sizing: border-box;
    border-radius: 5px;
    cursor: pointer;

    & * {
        display: flex;
    }

    :focus {
        outline: unset;
    }

    &: hover {
        opacity: 0.8;
    }
`

const StyledPrimaryActionLinkText = styled.div<{
    fontSize?: string
}>`
    font-size: ${(props) => (props.fontSize ? props.fontSize : '14px')};
    color: white;
`
export const PrimaryAction = ({
    label,
    onClick,
    disabled,
    innerRef,
    fontSize,
    isLoading,
    height,
    width,
}: {
    label: React.ReactNode
    onClick: React.MouseEventHandler
    disabled?: boolean
    innerRef?: any
    fontSize?: string
    isLoading?: boolean
    height?: string
    width?: string
}) => (
    <StyledPrimaryAction
        autoFocus
        tabIndex={0}
        onClick={disabled === true ? undefined : onClick}
        disabled={disabled}
        ref={innerRef}
        onKeyPress={(e) => (e.key === 'Enter' ? onClick(e) : false)}
        height={height}
        width={width}
    >
        {isLoading ? (
            <LoadingIndicator
                size="20px"
                thickness={3}
            />
        ) : (
            <StyledPrimaryActionLinkText fontSize={fontSize}>
                {label}
            </StyledPrimaryActionLinkText>
        )}
    </StyledPrimaryAction>
)
