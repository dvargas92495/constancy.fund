import styled from "styled-components";

const TextInputOneLine = styled.input`
    outline: none;
    height: fill-available;
    width: fill-available;
    font-size: 14px;
    border: none;
    background: transparent;
    padding: 15px 10px;
    min-height: 30px;
    color: ${(props) => props.theme.palette.text.primary}

    &::placeholder {
      color: #96a0b5;
    }
`;

export default TextInputOneLine