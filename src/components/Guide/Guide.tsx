import { ChangeEvent, useContext, useEffect, useState } from "react";
import GuideSection, {
  GuideSectionExtProps,
  buildSectionTranslation,
  getDefaultSection,
  getDefaultSectionName,
  getDefaultSectionTranslationName,
} from "../GuideSection/GuideSection";
import { Button, Col, Form, Row } from "react-bootstrap";
import {
  GuidesWorkspaceContext,
  GuidesWorkspaceContextAccessor,
} from "../GuidesWorkspace/GuidesWorkspace";
import { Floppy, Plus } from "react-bootstrap-icons";
import ConfirmationModal from "../modals/ConfirmationModal/ConfirmationModal";
import { isBlank } from "../../App";
import GuideTranslationType from "../../types/GuideTranslationType";
import GuideBuildTypeSelectionModal from "../modals/GuideBuildTypeSelectionModal/GuideBuildTypeSelectionModal";

export interface GuideExtProps {
  guideName: string;
  guideAuthor: string;
  guideSections: GuideSectionExtProps[];
}

interface GuideProps extends GuideExtProps, GuidesWorkspaceContextAccessor {
  onDeleteGuide: (indexToDelete: number) => void;
}

export function getDefaultGuideName(guideIndex: number) {
  return `Guide ${guideIndex + 1}`;
}

export function getDefaultGuide(): GuideExtProps {
  return {
    guideName: "",
    guideAuthor: "",
    guideSections: [],
  };
}

function Guide({
  indexPath,
  guideName = getDefaultGuideName(indexPath[0]),
  guideAuthor,
  guideSections,
  onDeleteGuide,
}: GuideProps) {
  const DEFAULT_SECTION_INDEX = -1;
  const SAVE_GUIDE_CANCELLED_MSG_NAME = "save-guide-cancelled";
  const SAVE_GUIDE_COMPLETED_MSG_NAME = "save-guide-completed";
  const EXPORT_GUIDE_CANCELLED_MSG_NAME = "export-guide-cancelled";
  const EXPORT_GUIDE_COMPLETED_MSG_NAME = "export-guide-completed";
  const [currentSectionIndex, setCurrentSectionIndex] = useState(
    DEFAULT_SECTION_INDEX
  );
  const [confirmModalIsVisible, setConfirmModalIsVisible] = useState(false);
  const [buildTypeModalIsVisible, setBuildTypeModalIsVisible] = useState(false);

  const guidesContext = useContext(GuidesWorkspaceContext);

  useEffect(() => {
    window.ipcRenderer.on(SAVE_GUIDE_COMPLETED_MSG_NAME, () => {
      guidesContext.setGuideHasChanges((guideHasChanges) => {
        guideHasChanges[indexPath[0]] = false;
      });
    });
  }, []);

  function handleOnAddSection() {
    let nGuides = guideSections.length;
    setCurrentSectionIndex(nGuides);
    guidesContext.setGuidesContext((guides) => {
      guides[indexPath[0]].guideSections.push(getDefaultSection());
    });
    guidesContext.setGuideHasChanges((guideHasChanges) => {
      guideHasChanges[indexPath[0]] = true;
    });
  }

  function handleOnBuildTypeSelection(selectedBuildType: GuideTranslationType) {
    let guideObj = { text: "" };
    buildGuideTranslation(guideObj, selectedBuildType);
    let mimeType = "text/x-lua";
    let fileExtension = "lua";
    let blob = new Blob([guideObj.text], {
      type: mimeType,
    });
    let blobUrl = URL.createObjectURL(blob);
    exportZygorGuide(blobUrl, fileExtension, mimeType);
  }

  function exportZygorGuide(
    blobUrl: string,
    fileExtension: string,
    mimeType: string,
    guideName: string = "Guide01"
  ) {
    let downloadProps = {
      downloadUrl: blobUrl,
      properties: {
        fileName: guideName,
        mimeType: mimeType,
        fileExtension: fileExtension,
      },
      cancelledMsgName: EXPORT_GUIDE_CANCELLED_MSG_NAME,
      completedMsgName: EXPORT_GUIDE_COMPLETED_MSG_NAME,
    };

    window.ipcRenderer.send("download-file", downloadProps);
  }

  function buildGuideTranslation(
    guideObj: { text: string },
    translationType: GuideTranslationType
  ) {
    type NextSectionInfo = {
      sectionName: string;
      sectionIndex: number;
    };

    //Build guide header
    guideObj.text += "local ZygorGuidesViewer=ZygorGuidesViewer\n";
    guideObj.text += "if not ZygorGuidesViewer then return end\n";

    //Build sections
    let guideName = guidesContext.guidesContext[indexPath[0]].guideName;
    guideName = !isBlank(guideName) ? guideName : `Guide${indexPath[0] + 1}`;
    let guideAuthor = guidesContext.guidesContext[indexPath[0]].guideAuthor;
    guidesContext.guidesContext[indexPath[0]].guideSections.forEach(
      (currentSection, index) => {
        let nextSectionInfo: NextSectionInfo | undefined = undefined;
        if (currentSection.nextSectionVal > -1) {
          let nextSectionProps: GuideSectionExtProps =
            guidesContext.guidesContext[indexPath[0]].guideSections[
              currentSection.nextSectionVal
            ];
          nextSectionInfo = {
            sectionIndex: currentSection.nextSectionVal,
            sectionName: !isBlank(nextSectionProps.sectionName)
              ? nextSectionProps.sectionName
              : getDefaultSectionTranslationName(currentSection.nextSectionVal),
          };
        }

        guideObj.text += "\n";
        buildSectionTranslation(
          guideObj,
          guideName,
          guideAuthor,
          currentSection,
          index,
          nextSectionInfo,
          translationType
        );
      }
    );
  }

  function handleOnSelectGuideSection(e: ChangeEvent<HTMLSelectElement>) {
    setCurrentSectionIndex(Number.parseInt(e.target.value));
  }

  function handleOnDeleteSection(indexToDelete: number) {
    let nSections = guideSections.length;
    if (nSections - 1 > 0) {
      setCurrentSectionIndex(Math.max(indexToDelete - 1, 0));
    } else {
      setCurrentSectionIndex(DEFAULT_SECTION_INDEX);
    }
    guidesContext.setGuideHasChanges((guideHasChanges) => {
      guideHasChanges[indexPath[0]] = true;
    });
  }

  function handleOnChangeGuideName(newName: string) {
    guidesContext.setGuidesContext((guides) => {
      guides[indexPath[0]].guideName = newName;
    });
    guidesContext.setGuideHasChanges((guideHasChanges) => {
      guideHasChanges[indexPath[0]] = true;
    });
  }

  function handleOnChangeGuideAuthor(newAuthorName: string) {
    guidesContext.setGuidesContext((guides) => {
      guides[indexPath[0]].guideAuthor = newAuthorName;
    });
    guidesContext.setGuideHasChanges((guideHasChanges) => {
      guideHasChanges[indexPath[0]] = true;
    });
  }

  function handleOnCloseGuide() {
    guidesContext.setGuidesContext((guides) => {
      guides.splice(indexPath[0], 1);
    });
    guidesContext.setGuideHasChanges((guideHasChanges) => {
      guideHasChanges.splice(indexPath[0], 1);
    });
    onDeleteGuide(indexPath[0]);
  }

  function getFormattedGuideName(): string {
    let currentName = guidesContext.guidesContext[indexPath[0]].guideName;
    if (currentName === "") {
      return "new_guide";
    }
    return currentName.replace(/[\/|\\:*?"<>]/g, " ");
  }

  function handleSaveGuide() {
    let toSaveGuide: GuideExtProps = guidesContext.guidesContext[indexPath[0]];
    let mimeType: string = "application/json";
    let blob = new Blob([JSON.stringify(toSaveGuide, null, "\t")], {
      type: mimeType,
    });
    let fileName = getFormattedGuideName();
    let fileExtension = "json";
    let blobUrl = URL.createObjectURL(blob);

    let downloadProps = {
      downloadUrl: blobUrl,
      properties: {
        fileName: fileName,
        mimeType: mimeType,
        fileExtension: fileExtension,
      },
      cancelledMsgName: SAVE_GUIDE_CANCELLED_MSG_NAME,
      completedMsgName: SAVE_GUIDE_COMPLETED_MSG_NAME,
    };

    window.ipcRenderer.send("download-file", downloadProps);
  }

  return (
    <>
      <div className="guide-data mb-4">
        <Row className="mb-4">
          <Col xs="auto">
            <Button
              title="Save guide"
              className="save-guide-button"
              onClick={() => handleSaveGuide()}
            >
              <Floppy />
            </Button>
          </Col>
          <Col xs="auto">
            <Button
              title="Build guide"
              variant="outline-primary"
              onClick={() => setBuildTypeModalIsVisible(true)}
            >
              Build guide
            </Button>
          </Col>
        </Row>
        <Row>
          <Col xs={4}>
            <Form.Group>
              <Form.Label>Guide name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Your guide name..."
                onChange={(e) => handleOnChangeGuideName(e.target.value)}
                value={guideName}
              />
            </Form.Group>
          </Col>
          <Col xs={4}>
            <Form.Group>
              <Form.Label>Author</Form.Label>
              <Form.Control
                onChange={(e) => handleOnChangeGuideAuthor(e.target.value)}
                type="text"
                value={guideAuthor}
                placeholder="Your guide author..."
              />
            </Form.Group>
          </Col>
          <Col xs="auto" className="ms-auto align-self-end">
            <Button
              variant="danger"
              title="Close guide"
              onClick={() => setConfirmModalIsVisible(true)}
            >
              Close guide
            </Button>
          </Col>
        </Row>
      </div>
      <div className="section-management mb-4">
        <Row>
          <Col xs={4}>
            <Form.Group>
              <Form.Label>Current section</Form.Label>
              <Form.Select
                aria-label="Section selection"
                onChange={(e) => handleOnSelectGuideSection(e)}
                value={currentSectionIndex}
              >
                <option
                  key={DEFAULT_SECTION_INDEX}
                  value={DEFAULT_SECTION_INDEX}
                >
                  Choose or add a section
                </option>
                {guideSections.map((nextGuideSection, index) => {
                  return (
                    <option key={index} value={index}>
                      {nextGuideSection.sectionName !== ""
                        ? nextGuideSection.sectionName
                        : getDefaultSectionName(index)}
                    </option>
                  );
                })}
              </Form.Select>
            </Form.Group>
          </Col>
          <Col xs="auto" className="d-flex align-items-center align-self-end">
            <Button
              variant="primary"
              title="Add section"
              onClick={() => handleOnAddSection()}
              className="p-0"
            >
              <Plus size="2.25rem" />
            </Button>
          </Col>
        </Row>
      </div>
      <div className="guide-content">
        {guideSections.map((nextGuideSection, index) => {
          if (index == currentSectionIndex) {
            return (
              <div key={index}>
                <GuideSection
                  indexPath={indexPath.concat(index)}
                  sectionName={nextGuideSection.sectionName}
                  sectionSteps={nextGuideSection.sectionSteps}
                  nextSectionVal={nextGuideSection.nextSectionVal}
                  defaultForRace={nextGuideSection.defaultForRace}
                  onDeleteSection={handleOnDeleteSection}
                ></GuideSection>
              </div>
            );
          }
        })}
      </div>
      <ConfirmationModal
        onConfirmation={handleOnCloseGuide}
        bodyText="The guide will close. Any changes that haven't been saved yet will be lost."
        setShowVal={setConfirmModalIsVisible}
        showVal={confirmModalIsVisible}
      />
      <GuideBuildTypeSelectionModal
        onBuildSelection={handleOnBuildTypeSelection}
        showVal={buildTypeModalIsVisible}
        setShowVal={setBuildTypeModalIsVisible}
      />
    </>
  );
}

export default Guide;
