import React from "react";
import { Accordion, Button, Col, Form, Row } from "react-bootstrap";
import SectionStep, { SectionStepProps } from "../SectionStep/SectionStep";

export interface GuideSectionExtProps {
  sectionName: string;
}

export interface GuideSectionProps extends GuideSectionExtProps {
  sectionIndex: number;
  onChangeSectionName: (newName: string, indexToUpdate: number) => void;
  onDeleteSection: (indexToDelete: number) => void;
}

export function getDefaultSectionName(sectionIndex: number) {
  return `Section ${sectionIndex + 1}`;
}

function GuideSection({
  sectionIndex,
  sectionName = getDefaultSectionName(sectionIndex),
  onChangeSectionName,
  onDeleteSection,
}: GuideSectionProps) {
  let sectionSteps: SectionStepProps[] = [
    { stepSummary: "Go to X,Y, Accept..." },
    { stepSummary: "Go to X,Y, Accept..." },
    { stepSummary: "Go to X,Y, Accept..." },
    { stepSummary: "Go to X,Y, Accept..." },
  ];

  return (
    <>
      <div className="section-data mb-4">
        <Row>
          <Col xs={4}>
            <Form.Group>
              <Form.Label>Section name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Your section name..."
                onChange={(e) =>
                  onChangeSectionName(e.target.value, sectionIndex)
                }
                value={sectionName}
              />
            </Form.Group>
          </Col>
          <Col xs="auto" className="ms-auto align-self-end">
            <Button
              variant="danger"
              title="Delete section"
              onClick={() => onDeleteSection(sectionIndex)}
            >
              Delete section
            </Button>
          </Col>
        </Row>
      </div>

      <Accordion alwaysOpen>
        {sectionSteps.map(function (nextStep, index) {
          return (
            <SectionStep
              stepSummary={nextStep.stepSummary}
              stepIndex={index}
            ></SectionStep>
          );
        })}
      </Accordion>
    </>
  );
}

export default GuideSection;
