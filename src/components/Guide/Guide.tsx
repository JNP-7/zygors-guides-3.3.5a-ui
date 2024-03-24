import { ChangeEvent, useContext, useState } from "react";
import GuideSection, {
  FINAL_SECTION_OPTION,
  GuideSectionExtProps,
  NO_DEFAULT_RACE_SECTION,
  getDefaultSectionName,
} from "../GuideSection/GuideSection";
import { Button, Col, Form, Row } from "react-bootstrap";
import {
  GuidesWorkspaceContext,
  GuidesWorkspaceContextAccessor,
} from "../GuidesWorkspace/GuidesWorkspace";
import TaskType from "../../types/TaskType";
import {
  CommentTaskExtProps,
  getDefaultCommentTask,
} from "../stepTasks/CommentTask/CommentTask";

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

  const guidesContext = useContext(GuidesWorkspaceContext);

  function handleOnAddSection() {
    let nGuides = guideSections.length;
    setCurrentSectionIndex(nGuides);
    guidesContext.setGuidesContext((guides) => {
      guides[indexPath[0]].guideSections.push({
        sectionName: "",
        sectionSteps: [{ stepTasks: [getDefaultCommentTask(0)] }],
        nextSectionVal: FINAL_SECTION_OPTION.value,
        defaultForRace: NO_DEFAULT_RACE_SECTION.value,
      });
    });
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

  function handleOnDeleteGuide() {
    guidesContext.setGuidesContext((guides) => {
      guides.splice(indexPath[0], 1);
    });
    onDeleteGuide(indexPath[0]);
  }

  return (
    <>
      <div className="guide-data mb-4">
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
              title="Delete guide"
              onClick={() => handleOnDeleteGuide()}
            >
              Delete guide
            </Button>
          </Col>
        </Row>
      </div>
      <div className="section-management mb-4">
        <Row>
          <Col xs="auto">
            <Button
              variant="primary"
              title="Add section"
              onClick={() => handleOnAddSection()}
            >
              Add section
            </Button>
          </Col>
          <Col xs="auto">
            <Form.Select
              aria-label="Section selection"
              onChange={(e) => handleOnSelectGuideSection(e)}
              value={currentSectionIndex}
            >
              <option key={DEFAULT_SECTION_INDEX} value={DEFAULT_SECTION_INDEX}>
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
          </Col>
        </Row>
      </div>
      <div className="guide-content">
        {currentSectionIndex >= 0 && (
          <GuideSection
            indexPath={indexPath.concat(currentSectionIndex)}
            sectionName={guideSections[currentSectionIndex].sectionName}
            sectionSteps={guideSections[currentSectionIndex].sectionSteps}
            nextSectionVal={guideSections[currentSectionIndex].nextSectionVal}
            defaultForRace={guideSections[currentSectionIndex].defaultForRace}
            onDeleteSection={handleOnDeleteSection}
          ></GuideSection>
        )}
      </div>
    </>
  );
}

export default Guide;
