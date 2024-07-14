import { ChangeEvent, useContext, useState } from "react";
import GuideSection, {
  GuideSectionExtProps,
  buildSectionTranslation,
  getDefaultSection,
  getDefaultSectionName,
} from "../GuideSection/GuideSection";
import { Button, Col, Form, Row } from "react-bootstrap";
import {
  GuidesWorkspaceContext,
  GuidesWorkspaceContextAccessor,
} from "../GuidesWorkspace/GuidesWorkspace";
import { Floppy, Plus } from "react-bootstrap-icons";
import ConfirmationModal from "../modals/ConfirmationModal/ConfirmationModal";
import { isBlank } from "../../App";

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
  const [currentSectionIndex, setCurrentSectionIndex] = useState(
    DEFAULT_SECTION_INDEX
  );
  const [confirmModalIsVisible, setConfirmModalIsVisible] = useState(false);

  const guidesContext = useContext(GuidesWorkspaceContext);

  function handleOnAddSection() {
    let nGuides = guideSections.length;
    setCurrentSectionIndex(nGuides);
    guidesContext.setGuidesContext((guides) => {
      guides[indexPath[0]].guideSections.push(getDefaultSection());
    });
  }

  async function handleOnBuildGuide() {
    let guideObj = { text: "" };
    buildGuideTranslation(guideObj);
    let blob = new Blob([guideObj.text], {
      type: " text/x-lua",
    });
    await Promise.all([exportZygorGuide(blob)]);
  }

  async function exportZygorGuide(blob: Blob, guideName: string = "Guide01") {
    const a = document.createElement("a");
    a.download = `${guideName}.lua`;
    a.href = URL.createObjectURL(blob);
    a.addEventListener("click", () => {
      setTimeout(() => URL.revokeObjectURL(a.href), 30 * 1000);
    });
    a.click();
  }

  function buildGuideTranslation(guideObj: { text: string }) {
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
              : `Section${currentSection.nextSectionVal + 1}`,
          };
        }

        guideObj.text += "\n";
        buildSectionTranslation(
          guideObj,
          guideName,
          guideAuthor,
          currentSection,
          index,
          nextSectionInfo
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
  }

  function handleOnChangeGuideName(newName: string) {
    guidesContext.setGuidesContext((guides) => {
      guides[indexPath[0]].guideName = newName;
    });
  }

  function handleOnChangeGuideAuthor(newAuthorName: string) {
    guidesContext.setGuidesContext((guides) => {
      guides[indexPath[0]].guideAuthor = newAuthorName;
    });
  }

  function handleOnCloseGuide() {
    guidesContext.setGuidesContext((guides) => {
      guides.splice(indexPath[0], 1);
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

  async function handleSaveGuide() {
    let toSaveGuide: GuideExtProps = guidesContext.guidesContext[indexPath[0]];
    let blob = new Blob([JSON.stringify(toSaveGuide, null, "\t")], {
      type: "application/json",
    });
    await Promise.all([saveGuide(blob, getFormattedGuideName())]);
  }

  async function saveGuide(blob: Blob, guideName: string) {
    const a = document.createElement("a");
    a.download = `${guideName}.json`;
    a.href = URL.createObjectURL(blob);
    a.addEventListener("click", () => {
      setTimeout(() => URL.revokeObjectURL(a.href), 30 * 1000);
    });
    a.click();
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
              onClick={() => handleOnBuildGuide()}
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
          return (
            <div
              key={index}
              className={index !== currentSectionIndex ? "d-none" : ""}
            >
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
        })}
      </div>
      <ConfirmationModal
        onConfirmation={handleOnCloseGuide}
        bodyText="The guide will close. Any changes that haven't been saved yet will be lost."
        setShowVal={setConfirmModalIsVisible}
        showVal={confirmModalIsVisible}
      />
    </>
  );
}

export default Guide;
