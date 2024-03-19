import { useRef } from "react";
import GuideSection, { GuideSectionProps } from "../GuideSection/GuideSection";
import { Col, Form, Row } from "react-bootstrap";

export interface GuideProps {
  guideIndex: number;
  guideName: string;
  onChangeGuideName?: (newName: string, indexToUpdate: number) => void;
  onChangeGuideAuthor?: (newAuthor: string, indexToUpdate: number) => void;
}

//Texts
const GUIDE_NAME_LABEL = "Guide name";
const GUIDE_NAME_PLACEHOLDER = "Your guide name...";
const AUTHOR_LABEL = "Author";
const AUTHOR_PLACEHOLDER = "Your guide author...";
//END - Texts

function Guide({
  guideIndex,
  guideName = "",
  onChangeGuideName,
  onChangeGuideAuthor,
}: GuideProps) {
  let guideSections: GuideSectionProps[] = [{ sectionName: "Section 1" }];

  function handleOnChangeGuideName(e: React.ChangeEvent<HTMLInputElement>) {
    if (onChangeGuideName !== undefined) {
      onChangeGuideName(e.target.value, guideIndex);
    }
  }

  return (
    <>
      <div className="guide-data">
        <Row>
          <Col xs={4}>
            <Form.Group>
              <Form.Label>{GUIDE_NAME_LABEL}</Form.Label>
              <Form.Control
                type="text"
                placeholder={GUIDE_NAME_PLACEHOLDER}
                onChange={(e) => handleOnChangeGuideName(e as any)}
                value={guideName}
              />
            </Form.Group>
          </Col>
          <Col xs={4}>
            <Form.Group>
              <Form.Label>{AUTHOR_LABEL}</Form.Label>
              <Form.Control type="text" placeholder={AUTHOR_PLACEHOLDER} />
            </Form.Group>
          </Col>
        </Row>
      </div>
      <div className="guide-content">
        {guideSections.map(function (nextGuideSection, index) {
          return (
            <GuideSection
              sectionName={nextGuideSection.sectionName}
            ></GuideSection>
          );
        })}
      </div>
    </>
  );
}

export default Guide;
