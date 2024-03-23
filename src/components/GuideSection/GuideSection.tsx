import { useContext } from "react";
import { Accordion, Button, Col, Form, Row } from "react-bootstrap";
import SectionStep, { SectionStepExtProps } from "../SectionStep/SectionStep";
import {
  GuidesWorkspaceContext,
  GuidesWorkspaceContextAccessor,
} from "../GuidesWorkspace/GuidesWorkspace";
import { CharacterRace } from "../../types/CharacterRace";

export interface GuideSectionExtProps {
  sectionName: string;
  sectionSteps: SectionStepExtProps[];
  nextSectionVal: string;
  defaultForRace: number;
}

export const FINAL_SECTION_OPTION = {
  text: "Final section",
  value: "-1",
};

export const NO_DEFAULT_RACE_SECTION = {
  text: "Final section",
  value: -1,
};

interface GuideSectionProps
  extends GuideSectionExtProps,
    GuidesWorkspaceContextAccessor {
  onDeleteSection: (indexToDelete: number) => void;
}

export function getDefaultSectionName(sectionIndex: number) {
  return `Section ${sectionIndex + 1}`;
}

function GuideSection({
  indexPath,
  sectionName = getDefaultSectionName(indexPath[1]),
  nextSectionVal,
  onDeleteSection,
}: GuideSectionProps) {
  const guidesContext = useContext(GuidesWorkspaceContext);
  let sectionSteps: SectionStepExtProps[] = [
    { stepSummary: "Go to X,Y, Accept..." },
    { stepSummary: "Go to X,Y, Accept..." },
    { stepSummary: "Go to X,Y, Accept..." },
    { stepSummary: "Go to X,Y, Accept..." },
  ];

  function handleOnSelectNextGuideSection(selectedVal: string) {
    guidesContext.setGuidesContext((guides) => {
      guides[indexPath[0]].guideSections[indexPath[1]].nextSectionVal =
        selectedVal;
    });
  }

  function handleOnChangeSectioName(newName: string) {
    guidesContext.setGuidesContext((guides) => {
      guides[indexPath[0]].guideSections[indexPath[1]].sectionName = newName;
    });
  }

  function handleOnDeleteSection() {
    onDeleteSection(indexPath[1]);
    /*Fix nextSection pointers*/
    guidesContext.guidesContext[indexPath[0]].guideSections.forEach(
      (guideSection, index) => {
        if (guideSection.nextSectionVal !== FINAL_SECTION_OPTION.value) {
          let nexSectionIndex = Number.parseInt(guideSection.nextSectionVal);
          if (nexSectionIndex > indexPath[1]) {
            /*Pointing to a section that's about to shift backwards in the array*/
            nexSectionIndex--;
            guidesContext.setGuidesContext((guides) => {
              guides[indexPath[0]].guideSections[index].nextSectionVal =
                nexSectionIndex.toString();
            });
          } else if (nexSectionIndex === indexPath[1]) {
            /*Pointing to the section about to be deleted, unset it*/
            guidesContext.setGuidesContext((guides) => {
              guides[indexPath[0]].guideSections[index].nextSectionVal =
                FINAL_SECTION_OPTION.value;
            });
          }
        }
      }
    );
    guidesContext.setGuidesContext((guides) => {
      guides[indexPath[0]].guideSections.splice(indexPath[1], 1);
    });
  }

  return (
    <>
      <div className="section-data mb-4">
        <Row className="mb-4">
          <Col xs={4}>
            <Form.Group>
              <Form.Label>Section name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Your section name..."
                onChange={(e) => handleOnChangeSectioName(e.target.value)}
                value={sectionName}
              />
            </Form.Group>
          </Col>
          <Col xs="auto" className="ms-auto align-self-end">
            <Button
              variant="danger"
              title="Delete section"
              onClick={() => handleOnDeleteSection()}
            >
              Delete section
            </Button>
          </Col>
        </Row>
        <Row>
          <Col xs={4}>
            <Form.Group>
              <Form.Label>Next section</Form.Label>
              <Form.Select
                aria-label="Next section selection"
                onChange={(e) => handleOnSelectNextGuideSection(e.target.value)}
                value={nextSectionVal}
              >
                <option
                  key={FINAL_SECTION_OPTION.value}
                  value={FINAL_SECTION_OPTION.value}
                >
                  {FINAL_SECTION_OPTION.text}
                </option>
                {guidesContext.guidesContext[indexPath[0]].guideSections.map(
                  (nextGuideSection, index) => {
                    return index !== indexPath[1] ? (
                      <option key={index} value={index}>
                        {nextGuideSection.sectionName !== ""
                          ? nextGuideSection.sectionName
                          : `<unnamed_section>`}
                      </option>
                    ) : (
                      <></>
                    );
                  }
                )}
              </Form.Select>
            </Form.Group>
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
