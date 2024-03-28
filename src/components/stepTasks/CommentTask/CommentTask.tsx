import { ItemUsageTaskProps } from "../../../types/CommonTaskProps";
import TaskType from "../../../types/TaskType";
import { StepTaskExtProps, StepTaskProps } from "../StepTask/StepTask";

export interface CommentTaskExtProps
  extends StepTaskExtProps,
    ItemUsageTaskProps {
  comment: string;
}

interface CommentTaskProps
  extends CommentTaskExtProps,
    StepTaskProps,
    ItemUsageTaskProps {}

export function getCommentTaskSummary(
  commentTaskProps: CommentTaskExtProps
): string {
  return commentTaskProps.comment;
}

export function getDefaultCommentTask(
  depth: number,
  subTasks: StepTaskExtProps[] = []
): CommentTaskExtProps {
  return {
    comment: "Do something",
    depth: depth,
    subTasks: subTasks,
    type: TaskType.COMMENT,
  };
}

function CommentTask(commentProps: CommentTaskProps) {
  return <p className="mb-0">{getCommentTaskSummary(commentProps)}</p>;
}

export default CommentTask;
