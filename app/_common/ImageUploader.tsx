// https://github.com/clerkinc/javascript/blob/05c0dcbbfddd8df949a2bd8df460feab9efcd065/packages/shared/components/imageUploader/ImageUploader.tsx

import React from "react";

import Icon from "./Icon";
import Dialog from "@mui/material/Dialog";
import styled from "styled-components";
import { PrimaryAction } from "./PrimaryAction";
import { LoadingIndicator } from "./LoadingIndicator";
import { SecondaryAction } from "./SecondaryAction";

const TitleContainer = styled.div`
  margin-bottom: 1.25em;
`;

const Title = styled.h1`
  display: flex;
  align-items: center;

  font-size: 2rem;
  font-weight: 600 !important;
  margin: 0 !important;

  > img {
    height: 2rem;
  }
`;

const Subtitle = styled.div`
  font-size: 1.25rem;
  font-style: normal;
  font-weight: 300;
  line-height: 1.5em;
  margin: 0;
`;

const Card = styled.div`
  padding: 3em 2em;

  + .card {
    margin-top: 2em;
  }

  @include media(upto small) {
    padding: 2em 1.5em;
  }

  @include media(xxsmall) {
    padding: 2em 1em;
  }

  margin: 0;
  background: #ffffff;
  box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.2);
  border-radius: 0.5em;
  overflow: hidden;
`;

enum UIState {
  Idle = "idle",
  Hover = "hover",
  Invalid = "invalid",
  Uploading = "uploading",
}

const ImageDefaultIcon = styled(Icon)`
  width: 4rem;
  height: 4rem;
  margin-bottom: 1.5rem;
`;

const FileInput = styled.input`
  display: none;
`;

const DropArea = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 17.25rem;
  padding: 4rem 2rem 2rem 2rem;
  border-radius: 0.5rem;
  border: 2px solid ${(props) => props.theme.palette.color.grey};
  background-color: ${(props) => props.theme.palette.color.grey};
  color: ${(props) => props.theme.palette.text.primary};
  margin-bottom: 0.5em;

  &.fileHover {
    color: ${(props) => props.theme.palette.primary.main};
    background-color: ${(props) => props.theme.palette.background.default};
    border-color: ${(props) => props.theme.palette.primary.main};
  }

  &.invalid {
    color: darkred;
    background-color: red;
    border-color: darkred;
  }
`;

type FileDropAreaProps = {
  acceptedTypes: SupportedMimeType[];
  sizeLimitBytes: number;
  handleSuccess: (file: File) => void;
  handleError?: () => void;
};

const FileDropArea = ({
  acceptedTypes,
  sizeLimitBytes,
  handleSuccess,
  handleError,
}: FileDropAreaProps): JSX.Element => {
  const [uiState, setUiState] = React.useState<UIState>(UIState.Idle);

  const fileRef = React.useRef<HTMLInputElement>(null);

  const promptForFile = () => {
    fileRef.current?.click();
  };

  const fileIsValid = (f: File): boolean => {
    return fileTypeIsValid(f.type) && fileSizeIsValid(f.size);
  };

  const fileTypeIsValid = (mime: string): mime is SupportedMimeType => {
    return acceptedTypes.includes(mime as SupportedMimeType);
  };

  const fileSizeIsValid = (bytes: number): boolean => {
    if (!sizeLimitBytes) {
      return true;
    }
    return bytes <= sizeLimitBytes;
  };

  const handleDragEnter = (ev: React.DragEvent) => {
    const files = ev.dataTransfer.items;
    if (files.length > 0 && !fileTypeIsValid(files[0].type)) {
      setUiState(UIState.Invalid);
    } else {
      setUiState(UIState.Hover);
    }
  };

  const handleDragLeave = (ev: React.DragEvent) => {
    const dropArea = ev.currentTarget,
      elLeaving = ev.relatedTarget as Element;
    if (dropArea.contains(elLeaving)) {
      return;
    }
    setUiState(UIState.Idle);
  };

  const handleOver = (ev: React.DragEvent) => {
    ev.preventDefault();
  };

  const handleDrop = (ev: React.DragEvent) => {
    ev.preventDefault();
    handleDragLeave(ev);
    const files = ev.dataTransfer.files;
    validateAndUpload(files[0]);
  };

  const areaHandlers = {
    onDragEnter: handleDragEnter,
    onDragLeave: handleDragLeave,
    onDragOver: handleOver,
    onDrop: handleDrop,
  };

  const handleInput = (ev: React.ChangeEvent<HTMLInputElement>) => {
    const files = ev.currentTarget.files || [];
    validateAndUpload(files[0]);
  };

  const validateAndUpload = (file: File) => {
    if (!file) {
      return;
    }
    if (!fileIsValid(file)) {
      handleError && handleError();
      return;
    }
    void uploadFile(file);
  };

  const uploadFile = async (file: File) => {
    setUiState(UIState.Uploading);
    handleSuccess(file);
  };

  const buttonEl = () => {
    const v = uiState == UIState.Idle ? "visible" : "hidden";
    return (
      <div style={{ visibility: v }}>
        <PrimaryAction
          label={
            <span>
              <Icon name="upload" /> Select file to upload
            </span>
          }
          onClick={promptForFile}
        />
        <FileInput
          type="file"
          accept={acceptedTypes.join(",")}
          ref={fileRef}
          onChange={handleInput}
        />
      </div>
    );
  };

  const states = {
    idle: (
      <DropArea {...areaHandlers}>
        <ImageDefaultIcon name={"image-default"} />
        <p>Drag file here, or</p>
        {buttonEl()}
      </DropArea>
    ),
    hover: (
      <DropArea className={`fileHover`} {...areaHandlers}>
        <ImageDefaultIcon name={"image-default"} />
        <p>Drop photo to upload</p>
        {buttonEl()}
      </DropArea>
    ),
    invalid: (
      <DropArea className="invalid" {...areaHandlers}>
        <ImageDefaultIcon name={"image-default"} />
        <p>Unsupported file type</p>
        {buttonEl()}
      </DropArea>
    ),
    uploading: (
      <DropArea {...areaHandlers}>
        <LoadingIndicator />
        <p style={{ marginTop: "3em" }}>Uploading file</p>
      </DropArea>
    ),
  };

  return states[uiState];
};

const MimeTypeToExtensionMap = Object.freeze({
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/gif": "gif",
  "image/webp": "webp",
  "image/x-icon": "ico",
  "image/vnd.microsoft.icon": "ico",
} as const);

type SupportedMimeType = keyof typeof MimeTypeToExtensionMap;

const extension = (mimeType: SupportedMimeType): string => {
  return MimeTypeToExtensionMap[mimeType];
};

type ImageUploaderProps = {
  title: string;
  subtitle: string;
  handleSuccess: (file: File) => Promise<unknown>;
  className?: string;
  children: React.ReactNode;
  acceptedTypes?: SupportedMimeType[];
  sizeLimitBytes?: number;
};

const IMAGE_UPLOADER_DEFAULT_TYPES: SupportedMimeType[] = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
];

const toSentence = (items: string[]): string => {
  // TODO: Once Safari supports it, use Intl.ListFormat
  if (items.length == 0) {
    return "";
  }
  if (items.length == 1) {
    return items[0];
  }
  let sentence = items.slice(0, -1).join(", ");
  sentence += `, or ${items.slice(-1)}`;
  return sentence;
};

function typesToSentence(types: SupportedMimeType[]): string {
  return toSentence(types.map((t) => extension(t).toUpperCase()));
}

const UploaderWrapper = styled.div`
  border-radius: 50%;
  overflow: hidden;
  position: relative;
  cursor: pointer;
  display: inline-flex;
  justify-content: center;
  align-items: center;
`;

const HelperText = styled.p`
  margin-top: 0.5em;
  color: gray;
`;

const HelperTextError = styled.p`
  color: red;
`;

function ImageUploader({
  title,
  subtitle,
  handleSuccess,
  children,
  acceptedTypes = IMAGE_UPLOADER_DEFAULT_TYPES,
  sizeLimitBytes = 10 * 1000 * 1000,
}: ImageUploaderProps): JSX.Element {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [hasFileError, setHasFileError] = React.useState(false);
  const openModal = () => {
    setIsModalOpen(true);
    setHasFileError(false);
  };
  const closeModal = () => setIsModalOpen(false);
  const uploadSuccess = (img: any) => {
    void handleSuccess(img).then(() => closeModal());
  };
  const uploadError = () => {
    setHasFileError(true);
  };

  const typesSentence = typesToSentence(acceptedTypes);
  const helpTexts = {
    normal: (
      <HelperText>Upload a {typesSentence} image smaller than 10 MB</HelperText>
    ),
    error: (
      <HelperTextError>
        Upload error. Select a {typesSentence} image smaller than 10MB and try
        again.
      </HelperTextError>
    ),
  };

  return (
    <>
      <Dialog open={isModalOpen} onClose={closeModal}>
        <Card>
          <TitleContainer>
            <Title>{title}</Title>
            <Subtitle>{subtitle}</Subtitle>
          </TitleContainer>
          <FileDropArea
            acceptedTypes={acceptedTypes}
            sizeLimitBytes={sizeLimitBytes}
            handleSuccess={uploadSuccess}
            handleError={uploadError}
          />
          {hasFileError ? helpTexts["error"] : helpTexts["normal"]}
          <SecondaryAction label={"Close"} onClick={closeModal} />
        </Card>
      </Dialog>
      <UploaderWrapper onClick={openModal}>{children}</UploaderWrapper>
    </>
  );
}

export default ImageUploader;
