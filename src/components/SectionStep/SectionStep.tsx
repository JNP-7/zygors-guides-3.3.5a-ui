import { useContext } from "react";
import Accordion from "react-bootstrap/Accordion";
import StepTask, {
  StepTaskExtProps,
  getTaskSummary,
} from "../stepTasks/StepTask/StepTask";
import { Button, ListGroup } from "react-bootstrap";
import {
  GuidesWorkspaceContext,
  GuidesWorkspaceContextAccessor,
} from "../GuidesWorkspace/GuidesWorkspace";
import { GuideExtProps } from "../Guide/Guide";
import Stack from "../../types/Stack";
import { Dash, Plus } from "react-bootstrap-icons";
import { getDefaultCommentTask } from "../stepTasks/CommentTask/CommentTask";

export interface SectionStepExtProps {
  stepTasks: StepTaskExtProps[];
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
  totalTasks += tasksStack.pushAll(currentStepProps.stepTasks);
  while (tasksStack.hasNext()) {
    let nextTask: StepTaskExtProps | undefined = tasksStack.pop();
    if (nextTask !== undefined) {
      totalTasks += tasksStack.pushAll(nextTask.subTasks);
    }
    if (totalTasks >= MAX_STEP_TASKS) return true;
  }
  return totalTasks >= MAX_STEP_TASKS;
}

interface SectionStepProps
  extends SectionStepExtProps,
    GuidesWorkspaceContextAccessor {
  onDeleteStep: (indexToDelete: number) => void;
  onAddStep: (indexToDelete: number) => void;
}

function SectionStep({
  stepTasks,
  indexPath,
  onDeleteStep,
  onAddStep,
}: SectionStepProps) {
  const guidesContext = useContext(GuidesWorkspaceContext);

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
      currentStepProps.stepTasks.map((nextStepTask, index) => {
        return {
          stepTaskProps: nextStepTask,
          indexPath: indexPath.concat(index),
        };
      })
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
          nextTask.stepTaskProps.subTasks.map((nextStepTask, index) => {
            return {
              stepTaskProps: nextStepTask,
              indexPath:
                nextTask !== undefined ? nextTask.indexPath.concat(index) : [],
            };
          })
        );
      }
    }

    if (stepSummary.length > STEP_SUMMARY_MAX_LENGTH) {
      stepSummary = stepSummary.slice(0, STEP_SUMMARY_MAX_LENGTH) + "...";
    }

    return stepSummary !== ""
      ? `//Step #${indexPath[2] + 1} | ${stepSummary}`
      : `//Step #${indexPath[2] + 1}`;
  }

  function isOnlySectionStep(): boolean {
    let sectionStepsSize: number =
      guidesContext.guidesContext[indexPath[0]].guideSections[indexPath[1]]
        .sectionSteps.length;
    return sectionStepsSize <= 1;
  }

  function handleOnAddStep() {
    guidesContext.setGuidesContext((guides) => {
      guides[indexPath[0]].guideSections[indexPath[1]].sectionSteps.splice(
        indexPath[2] + 1,
        0,
        { stepTasks: [getDefaultCommentTask(0)] }
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

  return (
    <Accordion.Item
      className="step-acordion-item"
      eventKey={indexPath[2].toString()}
    >
      <Accordion.Header className="position-relative">
        <span>{getStepSummary()}</span>
      </Accordion.Header>
      <div className="step-creation-buttons-container">
        <Button
          title="Add step"
          size="sm"
          variant="primary"
          onClick={() => handleOnAddStep()}
        >
          <Plus />
        </Button>
        {!isOnlySectionStep() && (
          <Button
            title="Remove this step"
            size="sm"
            variant="danger"
            className="ms-2"
            onClick={() => handleOnDeleteStep()}
          >
            <Dash />
          </Button>
        )}
      </div>
      <Accordion.Body>
        {stepTasks.length > 0 && (
          <ListGroup as="ul">
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
  );
}

export default SectionStep;
