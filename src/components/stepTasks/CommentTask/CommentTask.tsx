import { Form } from "react-bootstrap";
import {
  ItemUsageTaskProps,
  TaskEditionUpdateProps,
} from "../../../types/CommonTaskProps";
import TaskType from "../../../types/TaskType";
import { StepTaskExtProps } from "../StepTask/StepTask";
import { useRef } from "react";
import { IEditableTaskProps } from "../../modals/TaskEditionModal/TaskEditionModal";

export interface CommentTaskEditableProps
  extends IEditableTaskProps,
    ItemUsageTaskProps {
  comment: string;
}

export interface CommentTaskExtProps
  extends StepTaskExtProps,
    CommentTaskEditableProps {}

interface CommentTaskProps extends CommentTaskExtProps {}

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

interface CommentTaskEditionFormProps
  extends CommentTaskEditableProps,
    TaskEditionUpdateProps {}

export function CommentTaskEditionForm(
  commentTaskEditionProps: CommentTaskEditionFormProps
) {
  const commentInputRef = useRef<HTMLInputElement>(null);
  const itemNameInputRef = useRef<HTMLInputElement>(null);
  const itemIdInputRef = useRef<HTMLInputElement>(null);

  function buildCommentTaskProps(): CommentTaskEditableProps {
    let taskProps: CommentTaskEditableProps = {
      comment:
        commentInputRef.current?.value !== undefined
          ? commentInputRef.current.value
          : "",
    };
    if (
      itemIdInputRef.current?.value !== undefined &&
      itemIdInputRef.current.value !== ""
    ) {
      taskProps.itemId = Number.parseInt(itemIdInputRef.current.value);
    }
    if (
      itemNameInputRef.current?.value !== undefined &&
      itemNameInputRef.current.value !== ""
    ) {
      taskProps.itemName = itemNameInputRef.current.value;
    }
    return taskProps;
  }

  function handleOnInputChange() {
    commentTaskEditionProps.setProps(buildCommentTaskProps());
  }

  return (
    <Form>
      <Form.Group className="mb-3">
        <Form.Label>Comment</Form.Label>
        <Form.Control
          type="text"
          placeholder="The message for this task"
          value={commentTaskEditionProps.comment}
          onChange={() => handleOnInputChange()}
          ref={commentInputRef}
        />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Item name</Form.Label>
        <Form.Control
          type="text"
          placeholder="The name of the item to use"
          value={commentTaskEditionProps.itemName || ""}
          onChange={() => handleOnInputChange()}
          ref={itemNameInputRef}
        />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Item id</Form.Label>
        <Form.Control
          type="number"
          placeholder="The item's id"
          value={commentTaskEditionProps.itemId?.toString() || ""}
          onChange={() => handleOnInputChange()}
          ref={itemIdInputRef}
        />
      </Form.Group>
    </Form>
  );
}

export default CommentTask;
