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
} from "../CommentTask/CommentTask";
import { useContext } from "react";

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
    targetTask = stepTasks[indexPathToTask[3 + nextDepth]];
    if (nextDepth !== taskDepth) {
      stepTasks = targetTask.subTasks;
    }
  }

  return targetTask;
}

function StepTask({ depth, type, subTasks, indexPath }: StepTaskProps) {
  const guidesContext = useContext(GuidesWorkspaceContext);

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

  return (
    <ListGroup.Item as="li" key={indexPath[3 + depth]}>
      {getStepTaskNode()}
      {subTasks.length > 0 && (
        <ListGroup as="ul">
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
