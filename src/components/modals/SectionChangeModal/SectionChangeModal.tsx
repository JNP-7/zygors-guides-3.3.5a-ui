import { useContext, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { GuidesWorkspaceContext } from "../../GuidesWorkspace/GuidesWorkspace";
import { GuideSectionExtProps } from "../../GuideSection/GuideSection";
import { isBlank } from "../../../App";

const SECTION_SELECTOR_DEFAULT_VAL: number = -1;

interface SectionChangeModalProps {
  indexPath: number[];
  showVal: boolean;
  toIgnoreSectionsIndexes: number[];
  onHide?: () => void;
  title?: string;
  bodyText: string;
  onSelection: (selectedSection: number) => void;
  cancelText?: string;
  changeText?: string;
  setShowVal: React.Dispatch<React.SetStateAction<boolean>>;
}

interface SectionData {
  guideSectionProps: GuideSectionExtProps;
  sectionIndex: number;
  include: boolean;
}

function SectionChangeModal({
  indexPath,
  showVal,
  toIgnoreSectionsIndexes,
  onHide,
  title = "Select a section",
  bodyText,
  onSelection,
  cancelText = "Cancel",
  changeText = "Change",
  setShowVal,
}: SectionChangeModalProps) {
  const guidesContext = useContext(GuidesWorkspaceContext);

  const [sectionSelectorVal, setSectionSelectorVal] = useState<number>(
    SECTION_SELECTOR_DEFAULT_VAL
  );
  const [isDisabledConfirmButton, setIsDisabledConfirmButton] =
    useState<boolean>(true);

  function handleOnHide(isConfirm: boolean) {
    if (onHide !== undefined) {
      onHide();
    }
    if (isConfirm) {
      let selectedSection: number = sectionSelectorVal;
      if (selectedSection !== SECTION_SELECTOR_DEFAULT_VAL) {
        onSelection(selectedSection);
      }
    }
    setSectionSelectorVal(SECTION_SELECTOR_DEFAULT_VAL);
    setIsDisabledConfirmButton(true);
    setShowVal(false);
  }

  function buildSectionSelectorOptions(): JSX.Element[] {
    let options: JSX.Element[] = [];
    options.push(
      <option
        value={SECTION_SELECTOR_DEFAULT_VAL}
        key={SECTION_SELECTOR_DEFAULT_VAL}
      >
        Select one of the other sections...
      </option>
    );
    let sectionsData: SectionData[] = guidesContext.guidesContext[
      indexPath[0]
    ].guideSections.map(function (nextSection, index) {
      let nextData: SectionData = {
        guideSectionProps: nextSection,
        sectionIndex: index,
        include: toIgnoreSectionsIndexes.indexOf(index) === -1,
      };
      return nextData;
    });
    sectionsData.forEach(function (nextSection) {
      if (nextSection.include) {
        options.push(
          <option
            value={nextSection.sectionIndex}
            key={nextSection.sectionIndex}
          >
            {!isBlank(nextSection.guideSectionProps.sectionName.trim())
              ? nextSection.guideSectionProps.sectionName
              : `Section ${nextSection.sectionIndex + 1}`}
          </option>
        );
      }
    });
    return options;
  }

  function handleSectionSelectorChange(newVal: string): void {
    let newIntVal = SECTION_SELECTOR_DEFAULT_VAL;
    try {
      newIntVal = Number.parseInt(newVal);
    } catch (ex) {
      console.error(ex);
    }
    setSectionSelectorVal(newIntVal);
    setIsDisabledConfirmButton(newIntVal === SECTION_SELECTOR_DEFAULT_VAL);
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
        <p>{bodyText}</p>
        <Form.Select
          onChange={(e) => handleSectionSelectorChange(e.target.value)}
          value={sectionSelectorVal}
        >
          {buildSectionSelectorOptions()}
        </Form.Select>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => handleOnHide(false)}>
          {cancelText}
        </Button>
        <Button
          variant="primary"
          onClick={() => handleOnHide(true)}
          disabled={isDisabledConfirmButton}
        >
          {changeText}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default SectionChangeModal;
