import ListGroup from "react-bootstrap/ListGroup";
import {
  GuidesWorkspaceContext,
  GuidesWorkspaceContextAccessor,
} from "../../GuidesWorkspace/GuidesWorkspace";
import TaskType from "../../../types/TaskType";
import { GuideExtProps } from "../../Guide/Guide";
import CommentTask, {
  CommentTaskExtProps,
  getCommentTaskSummary,
  getDefaultCommentTask,
} from "../CommentTask/CommentTask";
import { useContext } from "react";
import { Button } from "react-bootstrap";
import { BoxArrowDownRight, Dash, Plus } from "react-bootstrap-icons";
import { stepIsMaxedOutOnTasks } from "../../SectionStep/SectionStep";

export interface StepTaskExtProps {
  depth: number;
  type: TaskType;
  subTasks: StepTaskExtProps[];
}
/*
  Starts at 0, and ends in 2 (total = 3). 
  Haven't seen tasks of more depth in any of the Zygor's guides
*/
export const MAX_TASK_DEPTH = 2;

export interface StepTaskProps
  extends StepTaskExtProps,
    GuidesWorkspaceContextAccessor {}

export function getTaskSummary(
  guidesContext: GuideExtProps[],
  indexPathToTask: number[],
  taskDepth: number
): string {
  let targetTask = getTargetTask(guidesContext, indexPathToTask, taskDepth);

  switch (targetTask.type) {
    case TaskType.COMMENT:
      return getCommentTaskSummary(targetTask as CommentTaskExtProps);
  }
}

export function getTargetTask(
  guidesContext: GuideExtProps[],
  indexPathToTask: number[],
  taskDepth: number
): StepTaskExtProps {
  let stepTasks: StepTaskExtProps[] =
    guidesContext[indexPathToTask[0]].guideSections[indexPathToTask[1]]
      .sectionSteps[indexPathToTask[2]].stepTasks;

  let targetTask: StepTaskExtProps = stepTasks[indexPathToTask[3]];

  for (let nextDepth = 1; nextDepth <= taskDepth; nextDepth++) {
    targetTask = targetTask.subTasks[indexPathToTask[3 + nextDepth]];
  }

  return targetTask;
}

export function getTargetTaskList(
  guidesContext: GuideExtProps[],
  indexPathToTask: number[],
  taskDepth: number
): StepTaskExtProps[] {
  let stepTasks: StepTaskExtProps[] =
    guidesContext[indexPathToTask[0]].guideSections[indexPathToTask[1]]
      .sectionSteps[indexPathToTask[2]].stepTasks;

  for (let nextDepth = 1; nextDepth <= taskDepth; nextDepth++) {
    stepTasks = stepTasks[indexPathToTask[3 + nextDepth - 1]].subTasks;
  }

  return stepTasks;
}

function StepTask({ depth, type, subTasks, indexPath }: StepTaskProps) {
  const guidesContext = useContext(GuidesWorkspaceContext);

  let isMaxedOutStep = stepIsMaxedOutOnTasks(
    indexPath,
    guidesContext.guidesContext
  );

  function handleOnRemoveTask() {
    guidesContext.setGuidesContext((guides) => {
      let targetTaskList = getTargetTaskList(guides, indexPath, depth);
      targetTaskList.splice(indexPath[3 + depth], 1);
    });
  }

  function handleOnAddSubtasksList() {
    guidesContext.setGuidesContext((guides) => {
      let targetTask = getTargetTask(guides, indexPath, depth);
      targetTask.subTasks.splice(0, 0, getDefaultCommentTask(depth + 1));
    });
  }

  function handleOnAddTask() {
    guidesContext.setGuidesContext((guides) => {
      let targetTaskList = getTargetTaskList(guides, indexPath, depth);
      targetTaskList.splice(
        indexPath[3 + depth] + 1,
        0,
        getDefaultCommentTask(depth)
      );
    });
  }

  function getStepTaskNode(): JSX.Element {
    let currentTask = getTargetTask(
      guidesContext.guidesContext,
      indexPath,
      depth
    );

    switch (type) {
      case TaskType.COMMENT:
        let currentCommentTask = currentTask as CommentTaskExtProps;
        return (
          <CommentTask
            comment={currentCommentTask.comment}
            depth={currentCommentTask.depth}
            indexPath={indexPath}
            subTasks={currentCommentTask.subTasks}
            type={currentCommentTask.type}
            itemId={currentCommentTask.itemId}
            itemName={currentCommentTask.itemName}
          ></CommentTask>
        );
    }
  }

  function isOnlyFirstLevelTask() {
    return (
      depth === 0 &&
      guidesContext.guidesContext[indexPath[0]].guideSections[indexPath[1]]
        .sectionSteps[indexPath[2]].stepTasks.length <= 1
    );
  }

  return (
    <ListGroup.Item as="li" className="task-container">
      {getStepTaskNode()}
      <div className="task-creation-buttons-container">
        <Button
          title="Add subtask"
          size="sm"
          variant="secondary"
          disabled={
            isMaxedOutStep || subTasks.length > 0 || depth >= MAX_TASK_DEPTH
          }
          onClick={() => handleOnAddSubtasksList()}
        >
          <BoxArrowDownRight />
        </Button>
        <Button
          title="Add task"
          size="sm"
          variant="primary"
          className="ms-1"
          disabled={isMaxedOutStep}
          onClick={() => handleOnAddTask()}
        >
          <Plus />
        </Button>
        <Button
          title="Remove this task"
          size="sm"
          variant="danger"
          className="ms-1"
          disabled={isOnlyFirstLevelTask()}
          onClick={() => handleOnRemoveTask()}
        >
          <Dash />
        </Button>
      </div>
      {subTasks.length > 0 && (
        <ListGroup as="ul" className="step-tasks-container">
          {subTasks.map((nextSubtask, index) => (
            <StepTask
              key={index}
              depth={nextSubtask.depth}
              subTasks={nextSubtask.subTasks}
              indexPath={indexPath.concat(index)}
              type={nextSubtask.type}
            ></StepTask>
          ))}
        </ListGroup>
      )}
    </ListGroup.Item>
  );
}

export default StepTask;
