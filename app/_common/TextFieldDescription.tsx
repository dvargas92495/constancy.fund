import styled from "styled-components";

const TextFieldDescriptionContainer = styled.label<{
  $small?: boolean;
}>`
  color: ${(props) => props.theme.palette.text.tertiary};
  font-size: ${(props) =>
    props.$small ? "14px !important" : "16px !important"};
  font-weight: 400;
  padding: 0;
  position: relative;
  line-height: 1.4375em;
`;

const Asterisk = styled.span``;

const TextFieldDescription: React.FC<{
  $small?: boolean;
  required: boolean;
}> = ({ $small, required, children }) => {
  return (
    <TextFieldDescriptionContainer $small={$small}>
      {children}
      {required && <Asterisk>*</Asterisk>}
    </TextFieldDescriptionContainer>
  );
};

export default TextFieldDescription;
