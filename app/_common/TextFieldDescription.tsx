import styled from "styled-components";
import FormLabel from "@mui/material/FormLabel";

const TextFieldDescription = styled(FormLabel)<{
  small?: boolean;
  required?: boolean;
}>`
  color: ${(props) => props.theme.palette.text.tertiary};
  font-size: ${(props) =>
    props.small ? "14px !important" : "16px !important"};
  font-weight: 400;
`;

export default TextFieldDescription;
