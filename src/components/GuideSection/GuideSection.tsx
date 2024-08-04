import { ChangeEvent, useContext, useState } from "react";
import { Accordion, Button, Col, Form, Row } from "react-bootstrap";
import SectionStep, {
  SectionStepExtProps,
  buildStepTranslation,
} from "../SectionStep/SectionStep";
import {
  GuidesWorkspaceContext,
  GuidesWorkspaceContextAccessor,
} from "../GuidesWorkspace/GuidesWorkspace";
import CharacterRace, {
  getCharacterRaceByOrdinal,
  getCharacterRaceOrdinal,
  getRaceWowApiValue,
} from "../../types/CharacterRace";
import { AccordionEventKey } from "react-bootstrap/esm/AccordionContext";
import ConfirmationModal from "../modals/ConfirmationModal/ConfirmationModal";
import { isBlank } from "../../App";
import { getDefaultCommentTask } from "../stepTasks/CommentTask/CommentTask";
import Paginator from "../Paginator/Paginator";
import { FolderSymlinkFill, Trash3 } from "react-bootstrap-icons";

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

export const MAX_STEPS_PER_PAGE: number = 2;

export function getDefaultSectionName(sectionIndex: number) {
  return `Section ${sectionIndex + 1}`;
}

export function getDefaultSection(): GuideSectionExtProps {
  return {
    sectionName: "",
    sectionSteps: [getDefaultSectionTask()],
    nextSectionVal: FINAL_SECTION_OPTION.value,
    defaultForRace: NO_DEFAULT_RACE_SECTION.value,
  };
}

export function getDefaultSectionTask(): SectionStepExtProps {
  return {
    stepTasks: [getDefaultCommentTask(0, [], false)],
    onlyForClasses: [],
  };
}

export function buildSectionTranslation(
  guideObj: { text: string },
  guideName: string,
  guideAuthor: string,
  guideSection: GuideSectionExtProps,
  sectionIndex: number,
  nextSectionInfo: { sectionName: string; sectionIndex: number } | undefined
) {
  let currentSectionName = !isBlank(guideSection.sectionName)
    ? guideSection.sectionName
    : `Section${sectionIndex + 1}`;

  guideObj.text += `ZygorGuidesViewer:RegisterGuide("${guideName}\\\\${currentSectionName}",[[\n`;
  guideObj.text += !isBlank(guideAuthor) ? `\tauthor ${guideAuthor}\n` : "";
  guideObj.text +=
    guideSection.defaultForRace > -1
      ? `\tdefaultfor ${getRaceWowApiValue(
          getCharacterRaceByOrdinal(guideSection.defaultForRace)
        )}\n`
      : "";
  guideObj.text +=
    nextSectionInfo !== undefined
      ? `\tnext ${guideName}\\\\${nextSectionInfo.sectionName}\n`
      : "";
  guideObj.text += "\tstartlevel 80\n";
  guideSection.sectionSteps.forEach((nextStep, stepIndex) => {
    buildStepTranslation(guideObj, nextStep, stepIndex);
  });
  guideObj.text += "]])\n";
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
  >(getInitialOpenAccordionKeys());
  const [confirmModalIsVisible, setConfirmModalIsVisible] =
    useState<boolean>(false);
  const [
    confirmStepsDeletionModalIsVisible,
    setStepsDeletionConfirmModalIsVisible,
  ] = useState<boolean>(false);
  const [currentStepsPage, setCurrentStepsPage] = useState<number>(1);
  const [checkedSectionSteps, setCheckedSectionSteps] = useState<boolean[]>(
    getInitialCheckedSectionSteps()
  );

  function getInitialOpenAccordionKeys(): boolean[] {
    let nSteps =
      guidesContext.guidesContext[indexPath[0]].guideSections[indexPath[1]]
        .sectionSteps.length;
    let initialOpenKeys: boolean[] = [];
    for (let index = 0; index < nSteps; index++) {
      initialOpenKeys.push(false);
    }
    return initialOpenKeys;
  }

  function getInitialCheckedSectionSteps(): boolean[] {
    let nSteps =
      guidesContext.guidesContext[indexPath[0]].guideSections[indexPath[1]]
        .sectionSteps.length;
    let initialCheckedSteps: boolean[] = [];
    for (let index = 0; index < nSteps; index++) {
      initialCheckedSteps.push(false);
    }
    return initialCheckedSteps;
  }

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
    let newNumberOfPages = 0;
    let removedEverything = false;
    guidesContext.setGuidesContext((guides) => {
      guides[indexPath[0]].guideSections[indexPath[1]].sectionSteps.splice(
        indexToDelete,
        1
      );
      let nStepsInCurrentSection: number =
        guides[indexPath[0]].guideSections[indexPath[1]].sectionSteps.length;
      newNumberOfPages =
        Math.trunc(nStepsInCurrentSection / MAX_STEPS_PER_PAGE) +
        (nStepsInCurrentSection % MAX_STEPS_PER_PAGE > 0 ? 1 : 0);
      removedEverything = nStepsInCurrentSection <= 0;
      if (removedEverything) {
        guides[indexPath[0]].guideSections[indexPath[1]].sectionSteps = [
          getDefaultSectionTask(),
        ];
      }
    });
    updateSectionStatesAfterStepsRemoval(
      indexToDelete,
      newNumberOfPages,
      removedEverything
    );
  }

  function updateSectionStatesAfterStepsRemoval(
    indexToDelete: number | number[],
    newNumberOfPages: number,
    removedEverything: boolean
  ) {
    if (!removedEverything) {
      if (Array.isArray(indexToDelete)) {
        setOpenAccordionKeyIsOpen(
          openAccordionKeyIsOpen.filter((_, index) => {
            return indexToDelete.indexOf(index) < 0;
          })
        );

        setCheckedSectionSteps(
          checkedSectionSteps.filter((_, index) => {
            return indexToDelete.indexOf(index) < 0;
          })
        );
      } else {
        setOpenAccordionKeyIsOpen(
          openAccordionKeyIsOpen.filter((_, index) => {
            return indexToDelete !== index;
          })
        );

        setCheckedSectionSteps(
          checkedSectionSteps.filter((_, index) => {
            return indexToDelete !== index;
          })
        );
      }
    } else {
      /*There is always a dummy step. In this case, set the open accordions 
      and the checked steps to a single not opened unchecked step */
      setOpenAccordionKeyIsOpen([false]);
      setCheckedSectionSteps([false]);
    }

    if (currentStepsPage > newNumberOfPages) {
      setCurrentStepsPage(newNumberOfPages > 0 ? newNumberOfPages : 1);
    }
  }

  function updateSectionStatesAfterStepsAdded(indexThatAdded: number) {
    setOpenAccordionKeyIsOpen([
      ...openAccordionKeyIsOpen.slice(0, indexThatAdded + 1),
      false,
      ...openAccordionKeyIsOpen.slice(indexThatAdded + 1),
    ]);
    setCheckedSectionSteps([
      ...checkedSectionSteps.slice(0, indexThatAdded + 1),
      false,
      ...checkedSectionSteps.slice(indexThatAdded + 1),
    ]);
  }

  function handleOnAddStep(indexThatAdded: number) {
    guidesContext.setGuidesContext((guides) => {
      guides[indexPath[0]].guideSections[indexPath[1]].sectionSteps.splice(
        indexThatAdded + 1,
        0,
        { stepTasks: [getDefaultCommentTask(0, [], false)], onlyForClasses: [] }
      );
    });
    updateSectionStatesAfterStepsAdded(indexThatAdded);
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
    let oldIndexOpenAccordionValue: boolean =
      openAccordionKeyIsOpen[indexToShift];
    let oldIndexIsCheckedValue: boolean = checkedSectionSteps[indexToShift];
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
      oldIndexOpenAccordionValue,
      ...filteredKeyIsOpen.slice(newPosition),
    ]);
    let filteredIsCheckedStep: boolean[] = checkedSectionSteps.filter(
      (_, index) => {
        return index !== indexToShift;
      }
    );
    setCheckedSectionSteps([
      ...filteredIsCheckedStep.slice(0, newPosition),
      oldIndexIsCheckedValue,
      ...filteredIsCheckedStep.slice(newPosition),
    ]);
  }

  function getOpenAccordionKeys(): string[] {
    let openAccordionKeys: string[] = [];
    openAccordionKeyIsOpen.forEach((nextKeyIsOpen, index) => {
      if (nextKeyIsOpen) openAccordionKeys.push(index.toString());
    });
    return openAccordionKeys;
  }

  function handleOnStepsPageSelection(selectedPage: number) {
    setCurrentStepsPage(selectedPage);
  }

  function handleOnSectionStepCheckChange(
    changedIndex: number,
    isChecked: boolean
  ) {
    setCheckedSectionSteps(
      checkedSectionSteps.map(
        (nextStepCheckStatus: boolean, curIndex: number) => {
          return curIndex === changedIndex ? isChecked : nextStepCheckStatus;
        }
      )
    );
  }

  function getTotalStepsPages(): number {
    let nSteps =
      guidesContext.guidesContext[indexPath[0]].guideSections[indexPath[1]]
        .sectionSteps.length;
    return (
      Math.trunc(nSteps / MAX_STEPS_PER_PAGE) +
      (nSteps % MAX_STEPS_PER_PAGE > 0 ? 1 : 0)
    );
  }

  function isVisibleStep(stepIndex: number): boolean {
    return (
      stepIndex >= (currentStepsPage - 1) * MAX_STEPS_PER_PAGE &&
      stepIndex < currentStepsPage * MAX_STEPS_PER_PAGE
    );
  }

  function currentPageHasCheckedSteps(): boolean {
    let curPageIndexesRange = getCurrentPageRangeIndexes();
    return checkedSectionSteps
      .slice(curPageIndexesRange.startIndex, curPageIndexesRange.endIndex)
      .includes(true);
  }

  function handleOnChangeGlobalChecker(e: ChangeEvent<HTMLInputElement>) {
    let newCheckedVal = e.target.checked;
    let curPageIndexesRange = getCurrentPageRangeIndexes();
    setCheckedSectionSteps(
      checkedSectionSteps.map((nextStepCheckedStatus, index) => {
        let isInRange =
          index >= curPageIndexesRange.startIndex &&
          index < curPageIndexesRange.endIndex;
        return isInRange ? newCheckedVal : nextStepCheckedStatus;
      })
    );
  }

  type IndexRange = {
    startIndex: number;
    endIndex: number; //endIndex is exclusive
  };

  function getCurrentPageRangeIndexes(): IndexRange {
    return {
      startIndex: (currentStepsPage - 1) * MAX_STEPS_PER_PAGE,
      endIndex: currentStepsPage * MAX_STEPS_PER_PAGE,
    };
  }

  function getTotalSelectedSectionSteps(): number {
    return checkedSectionSteps.filter(
      (nextStepStatusIsChecked) => nextStepStatusIsChecked
    ).length;
  }

  function handleDeleteSelectedSteps(): void {
    let toDeleteIndexes: number[] = [];
    checkedSectionSteps.forEach(function (isChecked, index) {
      if (isChecked) {
        toDeleteIndexes.push(index);
      }
    });

    let newNumberOfPages: number = 0;
    let removedEverything: boolean = false;
    guidesContext.setGuidesContext((guides) => {
      toDeleteIndexes
        .slice()
        .reverse() //Remove from last to first to check if we removed everything
        .forEach(function (nextIndexToDelete) {
          guides[indexPath[0]].guideSections[indexPath[1]].sectionSteps.splice(
            nextIndexToDelete,
            1
          );
          let nStepsInCurrentSection: number =
            guides[indexPath[0]].guideSections[indexPath[1]].sectionSteps
              .length;
          newNumberOfPages =
            Math.trunc(nStepsInCurrentSection / MAX_STEPS_PER_PAGE) +
            (nStepsInCurrentSection % MAX_STEPS_PER_PAGE > 0 ? 1 : 0);
          removedEverything = removedEverything || nStepsInCurrentSection <= 0;
        });
      if (removedEverything) {
        guides[indexPath[0]].guideSections[indexPath[1]].sectionSteps = [
          getDefaultSectionTask(),
        ];
      }
    });

    updateSectionStatesAfterStepsRemoval(
      toDeleteIndexes,
      newNumberOfPages,
      removedEverything
    );
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
              onClick={() => setConfirmModalIsVisible(true)}
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

      <Row className="mb-4 section-info-top-row">
        <Col xs={"auto"} className="me-auto d-flex-full-center">
          <Form.Check
            type="checkbox"
            checked={currentPageHasCheckedSteps()}
            className="d-flex-full-center page-steps-global-checker"
            onChange={(e) => handleOnChangeGlobalChecker(e)}
          />
          <p
            className={
              getTotalSelectedSectionSteps() > 0 ? "ms-2 mb-0" : "d-none"
            }
          >
            {getTotalSelectedSectionSteps()} of {checkedSectionSteps.length}{" "}
            steps selected
          </p>
          <Button
            size="sm"
            title="Move selected steps to another section"
            className={
              getTotalSelectedSectionSteps() > 0
                ? "ms-2 checked-steps-action-btn"
                : "d-none"
            }
          >
            <FolderSymlinkFill />
          </Button>
          <Button
            variant="danger"
            size="sm"
            title="Delete selected steps"
            className={
              getTotalSelectedSectionSteps() > 0
                ? "ms-2 checked-steps-action-btn"
                : "d-none"
            }
            onClick={() => setStepsDeletionConfirmModalIsVisible(true)}
          >
            <Trash3 />
          </Button>
        </Col>
        <Col xs={"auto"} className={getTotalStepsPages() > 1 ? "" : "d-none"}>
          <Paginator
            currentPage={currentStepsPage}
            totalPages={getTotalStepsPages()}
            onSelectPage={handleOnStepsPageSelection}
          ></Paginator>
        </Col>
      </Row>
      <Accordion
        alwaysOpen
        activeKey={getOpenAccordionKeys()}
        onSelect={handleOnSelectAccordion}
        className="steps-acordion"
      >
        {sectionSteps.map(function (nextStep, index) {
          if (isVisibleStep(index)) {
            return (
              <SectionStep
                key={index}
                stepTasks={nextStep.stepTasks}
                indexPath={indexPath.concat(index)}
                onlyForClasses={nextStep.onlyForClasses}
                onDeleteStep={handleOnDeleteStep}
                onAddStep={handleOnAddStep}
                onStepShift={handleOnStepShift}
                onStepCheckChange={handleOnSectionStepCheckChange}
                isChecked={checkedSectionSteps[index]}
              ></SectionStep>
            );
          }
        })}
      </Accordion>
      <Row
        className={
          getTotalStepsPages() > 1 ? "mt-4 justify-content-end" : "d-none"
        }
      >
        <Col xs={"auto"}>
          <Paginator
            currentPage={currentStepsPage}
            totalPages={getTotalStepsPages()}
            onSelectPage={handleOnStepsPageSelection}
          ></Paginator>
        </Col>
      </Row>

      <ConfirmationModal
        onConfirmation={handleOnDeleteSection}
        bodyText="This section will be delete. Any information related to it will be deleted as well."
        setShowVal={setConfirmModalIsVisible}
        showVal={confirmModalIsVisible}
      />
      <ConfirmationModal
        onConfirmation={handleDeleteSelectedSteps}
        bodyText="All the selected steps will be deleted. Any information related to them will be deleted as well."
        setShowVal={setStepsDeletionConfirmModalIsVisible}
        showVal={confirmStepsDeletionModalIsVisible}
      />
    </>
  );
}

export default GuideSection;
