import { useContext, useState } from "react";
import { Accordion, Button, Col, Form, Row } from "react-bootstrap";
import SectionStep, { SectionStepExtProps } from "../SectionStep/SectionStep";
import {
  GuidesWorkspaceContext,
  GuidesWorkspaceContextAccessor,
} from "../GuidesWorkspace/GuidesWorkspace";
import CharacterRace, {
  getCharacterRaceOrdinal,
} from "../../types/CharacterRace";
import { AccordionEventKey } from "react-bootstrap/esm/AccordionContext";

export interface GuideSectionExtProps {
  sectionName: string;
  sectionSteps: SectionStepExtProps[];
  nextSectionVal: number;
  defaultForRace: number;
}

export const FINAL_SECTION_OPTION = {
  text: "Final section",
  value: -1,
};

export const NO_DEFAULT_RACE_SECTION = {
  text: "Any",
  value: -1,
};

export function getDefaultSectionName(sectionIndex: number) {
  return `Section ${sectionIndex + 1}`;
}

interface GuideSectionProps
  extends GuideSectionExtProps,
    GuidesWorkspaceContextAccessor {
  onDeleteSection: (indexToDelete: number) => void;
}

function GuideSection({
  indexPath,
  sectionName = getDefaultSectionName(indexPath[1]),
  nextSectionVal,
  onDeleteSection,
  defaultForRace,
  sectionSteps,
}: GuideSectionProps) {
  const guidesContext = useContext(GuidesWorkspaceContext);
  const [openAccordionKeyIsOpen, setOpenAccordionKeyIsOpen] = useState<
    boolean[]
  >([false]);

  function handleOnSelectNextGuideSection(selectedVal: string) {
    guidesContext.setGuidesContext((guides) => {
      guides[indexPath[0]].guideSections[indexPath[1]].nextSectionVal =
        Number.parseInt(selectedVal);
    });
  }

  function handleOnSelectDefaultForRace(selectedVal: string) {
    guidesContext.setGuidesContext((guides) => {
      guides[indexPath[0]].guideSections[indexPath[1]].defaultForRace =
        Number.parseInt(selectedVal);
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
          let nexSectionIndex = guideSection.nextSectionVal;
          if (nexSectionIndex > indexPath[1]) {
            /*Pointing to a section that's about to shift backwards in the array*/
            nexSectionIndex--;
            guidesContext.setGuidesContext((guides) => {
              guides[indexPath[0]].guideSections[index].nextSectionVal =
                nexSectionIndex;
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

  function handleOnDeleteStep(indexToDelete: number) {
    setOpenAccordionKeyIsOpen(
      openAccordionKeyIsOpen.filter((_, index) => {
        return indexToDelete !== index;
      })
    );
  }

  function handleOnAddStep(indexThatAdded: number) {
    setOpenAccordionKeyIsOpen([
      ...openAccordionKeyIsOpen.slice(0, indexThatAdded + 1),
      false,
      ...openAccordionKeyIsOpen.slice(indexThatAdded + 1),
    ]);
  }

  function handleOnSelectAccordion(eventKey: AccordionEventKey) {
    if (eventKey instanceof Array) {
      let mappedKeys: number[] = eventKey.map((nextKey) =>
        Number.parseInt(nextKey)
      );
      setOpenAccordionKeyIsOpen(
        openAccordionKeyIsOpen.map((_, index) => {
          return mappedKeys.indexOf(index) >= 0;
        })
      );
    } else if (eventKey !== null && eventKey !== undefined) {
      let openIndex = Number.parseInt(eventKey);
      setOpenAccordionKeyIsOpen(
        openAccordionKeyIsOpen.map((_, index) => {
          return openIndex === index;
        })
      );
    } else {
      setOpenAccordionKeyIsOpen(
        openAccordionKeyIsOpen.map(() => {
          return false;
        })
      );
    }
  }

  function handleOnStepShift(indexToShift: number, shiftAmount: number) {
    let oldIndexValue: boolean = openAccordionKeyIsOpen[indexToShift];
    let newPosition: number = indexToShift + shiftAmount;
    if (newPosition < 0) {
      newPosition = 0;
    } else if (newPosition >= openAccordionKeyIsOpen.length) {
      newPosition = openAccordionKeyIsOpen.length - 1;
    }
    let filteredKeyIsOpen: boolean[] = openAccordionKeyIsOpen.filter(
      (_, index) => {
        return index !== indexToShift;
      }
    );
    setOpenAccordionKeyIsOpen([
      ...filteredKeyIsOpen.slice(0, newPosition),
      oldIndexValue,
      ...filteredKeyIsOpen.slice(newPosition),
    ]);
  }

  function getOpenAccordionKeys(): string[] {
    let openAccordionKeys: string[] = [];
    openAccordionKeyIsOpen.forEach((nextKeyIsOpen, index) => {
      if (nextKeyIsOpen) openAccordionKeys.push(index.toString());
    });
    return openAccordionKeys;
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
                {guidesContext.guidesContext[indexPath[0]].guideSections
                  .map((nextGuideSection, index) => {
                    return index !== indexPath[1]
                      ? { text: nextGuideSection.sectionName, value: index }
                      : null;
                  })
                  .filter((nextSectionObj) => {
                    return nextSectionObj !== null;
                  })
                  .map((nextSectionObj) => {
                    return (
                      <option
                        key={nextSectionObj?.value}
                        value={nextSectionObj?.value}
                      >
                        {nextSectionObj?.text !== ""
                          ? nextSectionObj?.text
                          : `<unnamed_section>`}
                      </option>
                    );
                  })}
              </Form.Select>
            </Form.Group>
          </Col>
          <Col xs={4}>
            <Form.Group>
              <Form.Label>Default for race</Form.Label>
              <Form.Select
                aria-label="This section will load by default for the choosen race"
                onChange={(e) => handleOnSelectDefaultForRace(e.target.value)}
                value={defaultForRace}
              >
                <option
                  key={NO_DEFAULT_RACE_SECTION.value}
                  value={NO_DEFAULT_RACE_SECTION.value}
                >
                  {NO_DEFAULT_RACE_SECTION.text}
                </option>
                {Object.entries(CharacterRace).map((nextRaceEntry) => {
                  return (
                    <option
                      key={getCharacterRaceOrdinal(nextRaceEntry[1])}
                      value={getCharacterRaceOrdinal(nextRaceEntry[1])}
                    >
                      {nextRaceEntry[1]}
                    </option>
                  );
                })}
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>
      </div>

      <Accordion
        alwaysOpen
        activeKey={getOpenAccordionKeys()}
        onSelect={handleOnSelectAccordion}
        className="steps-acordion"
      >
        {sectionSteps.map(function (nextStep, index) {
          return (
            <SectionStep
              key={index}
              stepTasks={nextStep.stepTasks}
              indexPath={indexPath.concat(index)}
              onlyForClasses={nextStep.onlyForClasses}
              onDeleteStep={handleOnDeleteStep}
              onAddStep={handleOnAddStep}
              onStepShift={handleOnStepShift}
            ></SectionStep>
          );
        })}
      </Accordion>
    </>
  );
}

export default GuideSection;
