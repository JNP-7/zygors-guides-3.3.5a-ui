import { useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import GuideTranslationType, {
  getTranslationTypeInfo,
} from "../../../types/GuideTranslationType";

const BUILD_TYPE_DEFAULT_VAL: GuideTranslationType = GuideTranslationType.FULL;

interface GuideBuildTypeSelectionModalProps {
  showVal: boolean;
  onHide?: () => void;
  title?: string;
  onBuildSelection: (selectedBuildType: GuideTranslationType) => void;
  cancelText?: string;
  buildText?: string;
  setShowVal: React.Dispatch<React.SetStateAction<boolean>>;
}

function GuideBuildTypeSelectionModal({
  showVal,
  onHide,
  title = "Select the build type",
  onBuildSelection,
  cancelText = "Cancel",
  buildText = "Build",
  setShowVal,
}: GuideBuildTypeSelectionModalProps) {
  const [buildTypeVal, setBuildTypeVal] = useState<GuideTranslationType>(
    BUILD_TYPE_DEFAULT_VAL
  );

  function handleOnHide(isConfirm: boolean) {
    if (onHide !== undefined) {
      onHide();
    }
    if (isConfirm) {
      onBuildSelection(buildTypeVal);
    }
    setBuildTypeVal(BUILD_TYPE_DEFAULT_VAL);
    setShowVal(false);
  }

  function handleBuildTypeChange(newValIdx: number): void {
    setBuildTypeVal(Object.values(GuideTranslationType)[newValIdx]);
  }

  return (
    <Modal
      backdrop="static"
      animation={false}
      show={showVal}
      onHide={() => handleOnHide(false)}
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {Object.values(GuideTranslationType).map(function (nextType, index) {
          return (
            <Form.Check
              key={index}
              name="selectBuildType"
              type="radio"
              label={nextType}
              value={index}
              title={getTranslationTypeInfo(nextType)}
              onChange={() => handleBuildTypeChange(index)}
              checked={nextType == buildTypeVal}
            />
          );
        })}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => handleOnHide(false)}>
          {cancelText}
        </Button>
        <Button variant="primary" onClick={() => handleOnHide(true)}>
          {buildText}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default GuideBuildTypeSelectionModal;
