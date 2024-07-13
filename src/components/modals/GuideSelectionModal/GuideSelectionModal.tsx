import { Button, Modal } from "react-bootstrap";
import { GuideExtProps, getDefaultGuide } from "../../Guide/Guide";
import {
  getSimpleGuidePropsFromLuaEntries,
  parseLuaWAQuestlogHistoryToArray,
} from "../../../utils/SavedVariablesUtils";

interface GuideSelectionModalProps {
  showVal: boolean;
  showCrossVal: boolean;
  title?: string;
  onPickGuide: (pickedGuide: GuideExtProps) => void;
  setShowVal: React.Dispatch<React.SetStateAction<boolean>>;
}

function GuideSelectionModal({
  showVal,
  showCrossVal,
  title = "Choose an option",
  onPickGuide,
  setShowVal,
}: GuideSelectionModalProps) {
  function handleOnEditExistingGuide() {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "application/json";
    fileInput.click();
    fileInput.addEventListener("change", (e) => {
      if (e.target !== null) {
        let targetInput: HTMLInputElement = e.target as HTMLInputElement;
        if (targetInput.files !== null && targetInput.files.length > 0) {
          let guideFile = targetInput.files[0];
          let fileReader = new FileReader();
          fileReader.addEventListener("load", () => {
            if (fileReader.result !== null) {
              let newGuideProps: GuideExtProps = JSON.parse(
                fileReader.result as string
              );
              onPickGuide(newGuideProps);
            }
          });
          fileReader.readAsText(guideFile);
        }
      }
    });
  }

  function handleOnImportRawLuaGuide() {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "text/x-lua";
    fileInput.click();
    fileInput.addEventListener("change", (e) => {
      if (e.target !== null) {
        let targetInput: HTMLInputElement = e.target as HTMLInputElement;
        if (targetInput.files !== null && targetInput.files.length > 0) {
          let rawLuaFile = targetInput.files[0];
          let fileReader = new FileReader();
          fileReader.addEventListener("load", () => {
            if (fileReader.result !== null) {
              let guideEntries = parseLuaWAQuestlogHistoryToArray(
                fileReader.result as string
              );
              let newGuideProps: GuideExtProps =
                getSimpleGuidePropsFromLuaEntries(guideEntries);
              onPickGuide(newGuideProps);
            }
          });
          fileReader.readAsText(rawLuaFile);
        }
      }
    });
  }

  function handleOnCreateNewGuide() {
    let newGuide: GuideExtProps = getDefaultGuide();
    onPickGuide(newGuide);
  }

  return (
    <Modal
      backdrop="static"
      onHide={() => setShowVal(false)}
      animation={false}
      show={showVal}
      centered
    >
      <Modal.Header closeButton={showCrossVal}>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body className="d-flex-full-center flex-column">
        <Button
          variant="primary"
          className="my-4"
          onClick={() => handleOnEditExistingGuide()}
        >
          Edit an existing guide
        </Button>
        <Button
          variant="primary"
          className="mb-4"
          onClick={() => handleOnImportRawLuaGuide()}
        >
          Import from raw LUA
        </Button>
        <Button
          variant="secondary"
          className="mb-4"
          onClick={() => handleOnCreateNewGuide()}
        >
          Create a new one
        </Button>
      </Modal.Body>
    </Modal>
  );
}

export default GuideSelectionModal;
