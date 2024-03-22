import { ChangeEvent, useRef, useState } from "react";
import GuideSection, {
  GuideSectionExtProps,
  getDefaultSectionName,
} from "../GuideSection/GuideSection";
import { Button, Col, Form, Row } from "react-bootstrap";

export interface GuideExtProps {
  guideName: string;
}

export interface GuideProps extends GuideExtProps {
  guideIndex: number;
  onChangeGuideName: (newName: string, indexToUpdate: number) => void;
  onDeleteGuide: (indexToDelete: number) => void;
}

export function getDefaultGuideName(guideIndex: number) {
  return `Guide ${guideIndex + 1}`;
}

function Guide({
  guideIndex,
  guideName = getDefaultGuideName(guideIndex),
  onChangeGuideName,
  onDeleteGuide,
}: GuideProps) {
  const DEFAULT_SECTION_INDEX = -1;
  const [currentSectionIndex, setCurrentSectionIndex] = useState(
    DEFAULT_SECTION_INDEX
  );
  const [guideSections, setGuideSections] = useState<GuideSectionExtProps[]>(
    []
  );

  function handleOnAddSection() {
    let nGuides = guideSections.length;
    setCurrentSectionIndex(nGuides);
    setGuideSections([
      ...guideSections,
      {
        sectionName: "",
      },
    ]);
  }

  function handleOnSelectGuideSection(e: ChangeEvent<HTMLSelectElement>) {
    setCurrentSectionIndex(Number.parseInt(e.target.value));
  }

  function handleOnChangeSectionName(newName: string, indexToUpdate: number) {
    const nextGuideSections: GuideSectionExtProps[] = guideSections.map(
      (nextGuideSection, index) => {
        return index === indexToUpdate
          ? { ...nextGuideSection, sectionName: newName }
          : nextGuideSection;
      }
    );
    setGuideSections(nextGuideSections);
  }

  function handleOnDeleteSection(indexToDelete: number) {
    let nSections = guideSections.length;
    if (nSections - 1 > 0) {
      setCurrentSectionIndex(Math.max(indexToDelete - 1, 0));
    } else {
      setCurrentSectionIndex(DEFAULT_SECTION_INDEX);
    }
    let nextGuideSections: GuideSectionExtProps[] = guideSections.filter(
      (_, index) => {
        return index !== indexToDelete;
      }
    );
    setGuideSections(nextGuideSections);
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
                onChange={(e) => onChangeGuideName(e.target.value, guideIndex)}
                value={guideName}
              />
            </Form.Group>
          </Col>
          <Col xs={4}>
            <Form.Group>
              <Form.Label>Author</Form.Label>
              <Form.Control type="text" placeholder="Your guide author..." />
            </Form.Group>
          </Col>
          <Col xs="auto" className="ms-auto align-self-end">
            <Button
              variant="danger"
              title="Delete guide"
              onClick={() => onDeleteGuide(guideIndex)}
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
            sectionName={guideSections[currentSectionIndex].sectionName}
            sectionIndex={currentSectionIndex}
            onChangeSectionName={handleOnChangeSectionName}
            onDeleteSection={handleOnDeleteSection}
          ></GuideSection>
        )}
      </div>
    </>
  );
}

export default Guide;
