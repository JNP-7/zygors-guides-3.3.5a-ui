import { useContext, useState } from "react";
import Accordion from "react-bootstrap/Accordion";
import StepTask, {
  StepTaskExtProps,
  buildTaskTranslation,
  getTaskSummary,
} from "../stepTasks/StepTask/StepTask";
import { Button, Col, Form, ListGroup, Row } from "react-bootstrap";
import {
  GuidesWorkspaceContext,
  GuidesWorkspaceContextAccessor,
} from "../GuidesWorkspace/GuidesWorkspace";
import { GuideExtProps } from "../Guide/Guide";
import Stack from "../../types/Stack";
import { ChevronDown, ChevronUp, Dash, Plus } from "react-bootstrap-icons";
import { getDefaultCommentTask } from "../stepTasks/CommentTask/CommentTask";
import CharacterClass, {
  getCharacterClassOrdinal,
} from "../../types/CharacterClass";
import ConfirmationModal from "../modals/ConfirmationModal/ConfirmationModal";
import TaskType from "../../types/TaskType";
import { GetTaskExtProps, ToLootNPC } from "../stepTasks/GetTask/GetTask";
import { isBlank } from "../../App";

export interface SectionStepExtProps {
  stepTasks: StepTaskExtProps[];
  onlyForClasses: string[];
}

export const MAX_STEP_TASKS = 20; //According to the addon documentation
export const STEP_SUMMARY_MAX_LENGTH = 80;

export function stepIsMaxedOutOnTasks(
  stepIndexPath: number[],
  guidesContext: GuideExtProps[]
) {
  let currentStepProps =
    guidesContext[stepIndexPath[0]].guideSections[stepIndexPath[1]]
      .sectionSteps[stepIndexPath[2]];

  let totalTasks = 0;
  let tasksStack: Stack<StepTaskExtProps> = new Stack<StepTaskExtProps>();
  totalTasks +=
    tasksStack.pushAll(currentStepProps.stepTasks) +
    doubleLineTasks(currentStepProps.stepTasks);
  while (tasksStack.hasNext()) {
    let nextTask: StepTaskExtProps | undefined = tasksStack.pop();
    if (nextTask !== undefined) {
      totalTasks +=
        tasksStack.pushAll(nextTask.subTasks) +
        doubleLineTasks(nextTask.subTasks);
    }
    if (totalTasks >= MAX_STEP_TASKS) return true;
  }
  return totalTasks >= MAX_STEP_TASKS;
}

//Some kind of tasks might generate 2 lines (2 tasks) in the addon's syntaxis
function doubleLineTasks(tasksToCheck: StepTaskExtProps[]): number {
  let totalDoubleLiners = 0;

  tasksToCheck.forEach((nextTaskToCheck) => {
    let isDoubleLiner = false;
    switch (nextTaskToCheck.type) {
      case TaskType.GET:
        let getTaskToCheck = nextTaskToCheck as GetTaskExtProps;
        for (
          let i = 0;
          i < getTaskToCheck.toLootNpcs.length && !isDoubleLiner;
          i++
        ) {
          let nextLootableNPC: ToLootNPC = getTaskToCheck.toLootNpcs[i];
          if (
            !isBlank(nextLootableNPC.npcName) &&
            nextLootableNPC.npcId !== undefined
          ) {
            isDoubleLiner = true;
          }
        }
        break;
    }
    if (isDoubleLiner) {
      totalDoubleLiners++;
    }
  });

  return totalDoubleLiners;
}

export function buildStepTranslation(
  guideObj: { text: string },
  stepProps: SectionStepExtProps,
  stepIndex: number
) {
  guideObj.text += `\tstep//${stepIndex + 1}\n`;
  stepProps.stepTasks.forEach((nextTask) => {
    buildTaskTranslation(guideObj, nextTask);
  });
  if (stepProps.onlyForClasses.length > 0) {
    let classesText: string = "";
    stepProps.onlyForClasses.forEach((nextClass, index) => {
      if (!isNaN(Number.parseInt(nextClass))) {
        let classIndex = Number.parseInt(nextClass);
        classesText += Object.values(CharacterClass)[classIndex].toString();
        if (index < stepProps.onlyForClasses.length - 1) {
          classesText += ",";
        }
      }
    });
    guideObj.text += `\t\tonly ${classesText}\n`;
  }
}

interface SectionStepProps
  extends SectionStepExtProps,
    GuidesWorkspaceContextAccessor {
  onDeleteStep: (indexToDelete: number) => void;
  onAddStep: (indexToDelete: number) => void;
  onStepShift: (indexToShift: number, shiftAmount: number) => void;
}

function SectionStep({
  stepTasks,
  indexPath,
  onlyForClasses,
  onDeleteStep,
  onAddStep,
  onStepShift,
}: SectionStepProps) {
  const guidesContext = useContext(GuidesWorkspaceContext);
  const [confirmModalIsVisible, setConfirmModalIsVisible] = useState(false);

  function getStepSummary(): string {
    let stepSummary: string = "";

    let currentStepProps =
      guidesContext.guidesContext[indexPath[0]].guideSections[indexPath[1]]
        .sectionSteps[indexPath[2]];

    interface ISummaryStepTask {
      stepTaskProps: StepTaskExtProps;
      indexPath: number[];
    }
    let tasksStack: Stack<ISummaryStepTask> = new Stack<ISummaryStepTask>();

    tasksStack.pushAll(
      currentStepProps.stepTasks
        .map((nextStepTask, index) => {
          return {
            stepTaskProps: nextStepTask,
            indexPath: indexPath.concat(index),
          };
        })
        .toReversed()
    );
    while (
      tasksStack.hasNext() &&
      stepSummary.length <= STEP_SUMMARY_MAX_LENGTH
    ) {
      let nextTask = tasksStack.pop();
      if (stepSummary != "") {
        stepSummary += ", ";
      }
      if (nextTask !== undefined) {
        stepSummary += getTaskSummary(
          guidesContext.guidesContext,
          nextTask.indexPath,
          nextTask.stepTaskProps.depth
        );
        tasksStack.pushAll(
          nextTask.stepTaskProps.subTasks
            .map((nextStepTask, index) => {
              return {
                stepTaskProps: nextStepTask,
                indexPath:
                  nextTask !== undefined
                    ? nextTask.indexPath.concat(index)
                    : [],
              };
            })
            .toReversed()
        );
      }
    }

    if (stepSummary.length > STEP_SUMMARY_MAX_LENGTH) {
      stepSummary = stepSummary.slice(0, STEP_SUMMARY_MAX_LENGTH) + "...";
    }

    return stepSummary !== ""
      ? `Step ${indexPath[2] + 1}: ${stepSummary}`
      : `Step ${indexPath[2] + 1}`;
  }

  function isOnlySectionStep(): boolean {
    let sectionStepsSize: number =
      guidesContext.guidesContext[indexPath[0]].guideSections[indexPath[1]]
        .sectionSteps.length;
    return sectionStepsSize <= 1;
  }

  function isFirstStep() {
    return indexPath[2] === 0;
  }

  function isLastStep() {
    return (
      guidesContext.guidesContext[indexPath[0]].guideSections[indexPath[1]]
        .sectionSteps.length -
        1 ===
      indexPath[2]
    );
  }

  function handleOnAddStep() {
    guidesContext.setGuidesContext((guides) => {
      guides[indexPath[0]].guideSections[indexPath[1]].sectionSteps.splice(
        indexPath[2] + 1,
        0,
        { stepTasks: [getDefaultCommentTask(0)], onlyForClasses: [] }
      );
    });
    onAddStep(indexPath[2]);
  }

  function handleOnDeleteStep() {
    guidesContext.setGuidesContext((guides) => {
      guides[indexPath[0]].guideSections[indexPath[1]].sectionSteps.splice(
        indexPath[2],
        1
      );
    });
    onDeleteStep(indexPath[2]);
  }

  function handleOnStepShift(shiftAmount: number) {
    guidesContext.setGuidesContext((guides) => {
      let newIndex = indexPath[2] + shiftAmount;
      let currentStep =
        guides[indexPath[0]].guideSections[indexPath[1]].sectionSteps[
          indexPath[2]
        ];
      guides[indexPath[0]].guideSections[indexPath[1]].sectionSteps.splice(
        indexPath[2],
        1
      );
      guides[indexPath[0]].guideSections[indexPath[1]].sectionSteps.splice(
        newIndex,
        0,
        currentStep
      );
    });
    onStepShift(indexPath[2], shiftAmount);
  }

  function handleOnSelectOnlyForClasses(
    choosenValues: HTMLCollectionOf<HTMLOptionElement>
  ) {
    let classesValues: string[] = [];
    for (let i = 0; i < choosenValues.length; i++) {
      classesValues.push(choosenValues[i].value);
    }
    guidesContext.setGuidesContext((guides) => {
      guides[indexPath[0]].guideSections[indexPath[1]].sectionSteps[
        indexPath[2]
      ].onlyForClasses = classesValues;
    });
  }

  return (
    <>
      <Accordion.Item
        className="step-acordion-item"
        eventKey={indexPath[2].toString()}
      >
        <Accordion.Header className="position-relative">
          <span>{getStepSummary()}</span>
        </Accordion.Header>
        <div className="step-shift-buttons-container">
          <Button
            title="Shift step upwards"
            size="sm"
            variant="primary"
            disabled={isFirstStep()}
            onClick={() => handleOnStepShift(-1)}
          >
            <ChevronUp />
          </Button>
          <Button
            title="Shift step downwards"
            size="sm"
            variant="primary"
            disabled={isLastStep()}
            onClick={() => handleOnStepShift(1)}
          >
            <ChevronDown />
          </Button>
        </div>
        <div className="step-creation-buttons-container">
          <Button
            title="Add step"
            size="sm"
            variant="primary"
            onClick={() => handleOnAddStep()}
          >
            <Plus size="1.15rem" />
          </Button>
          <Button
            title="Remove this step"
            size="sm"
            variant="danger"
            className="ms-2"
            disabled={isOnlySectionStep()}
            onClick={() => setConfirmModalIsVisible(true)}
          >
            <Dash size="1.15rem" />
          </Button>
        </div>
        <Accordion.Body>
          <Row className="mb-2">
            <Col xs={4}>
              <Accordion className="step-for-class-accordion">
                <Accordion.Item
                  eventKey={"onlyForClassSelector-" + indexPath.join("-")}
                >
                  <Accordion.Header>{`Only for class(es)`}</Accordion.Header>
                  <Accordion.Body>
                    <Form.Select
                      multiple={true}
                      aria-label="This step will only load for the choosen races"
                      onChange={(e) =>
                        handleOnSelectOnlyForClasses(e.target.selectedOptions)
                      }
                      value={onlyForClasses}
                    >
                      {Object.entries(CharacterClass).map((nextClassEntry) => {
                        return (
                          <option
                            key={getCharacterClassOrdinal(
                              nextClassEntry[1]
                            ).toString()}
                            value={getCharacterClassOrdinal(
                              nextClassEntry[1]
                            ).toString()}
                          >
                            {nextClassEntry[1]}
                          </option>
                        );
                      })}
                    </Form.Select>
                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>
            </Col>
          </Row>
          {stepTasks.length > 0 && (
            <ListGroup as="ul" className="step-tasks-container">
              {stepTasks.map((nextTask, index) => (
                <StepTask
                  key={index}
                  type={nextTask.type}
                  depth={nextTask.depth}
                  indexPath={indexPath.concat(index)}
                  subTasks={nextTask.subTasks}
                ></StepTask>
              ))}
            </ListGroup>
          )}
        </Accordion.Body>
      </Accordion.Item>
      <ConfirmationModal
        onConfirmation={handleOnDeleteStep}
        bodyText="This step an all its tasks will be deleted."
        setShowVal={setConfirmModalIsVisible}
        showVal={confirmModalIsVisible}
      />
    </>
  );
}

export default SectionStep;
