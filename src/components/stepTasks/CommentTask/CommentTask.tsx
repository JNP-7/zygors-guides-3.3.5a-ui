import { Form } from "react-bootstrap";
import {
  ItemUsageTaskProps,
  TadkEditionUpdateProps,
} from "../../../types/CommonTaskProps";
import TaskType from "../../../types/TaskType";
import { StepTaskExtProps, StepTaskProps } from "../StepTask/StepTask";
import { useRef } from "react";

export interface CommentTaskExtProps
  extends StepTaskExtProps,
    ItemUsageTaskProps {
  comment: string;
}

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
  extends CommentTaskExtProps,
    TadkEditionUpdateProps {}

export function CommentTaskEditionForm(
  commentTaskEditionProps: CommentTaskEditionFormProps
) {
  const commentInputRef = useRef<HTMLInputElement>(null);
  const itemNameInputRef = useRef<HTMLInputElement>(null);
  const itemIdInputRef = useRef<HTMLInputElement>(null);

  function buildCommentTaskProps(): CommentTaskExtProps {
    return {
      comment:
        commentInputRef.current?.value !== undefined
          ? commentInputRef.current.value
          : commentTaskEditionProps.comment,
      itemId:
        itemIdInputRef.current?.value !== undefined
          ? Number.parseInt(itemIdInputRef.current?.value)
          : commentTaskEditionProps.itemId,
      itemName:
        itemNameInputRef.current?.value !== undefined
          ? itemNameInputRef.current?.value
          : commentTaskEditionProps.itemName,
      depth: commentTaskEditionProps.depth,
      subTasks: commentTaskEditionProps.subTasks,
      type: commentTaskEditionProps.type,
    };
  }

  function handleOnInputChange() {
    commentTaskEditionProps.setProps(buildCommentTaskProps());
  }

  return (
    <Form>
      <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
        <Form.Label>Comment*</Form.Label>
        <Form.Control
          type="text"
          placeholder="The message for this task"
          value={commentTaskEditionProps.comment}
          onChange={() => handleOnInputChange()}
          ref={commentInputRef}
          required
        />
      </Form.Group>
      <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
        <Form.Label>Item name</Form.Label>
        <Form.Control
          type="text"
          placeholder="The name of the item to use"
          value={commentTaskEditionProps.itemName}
          onChange={() => handleOnInputChange()}
          ref={itemNameInputRef}
        />
      </Form.Group>
      <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
        <Form.Label>Item id</Form.Label>
        <Form.Control
          type="number"
          placeholder="The item's id"
          value={commentTaskEditionProps.itemId}
          onChange={() => handleOnInputChange()}
          ref={itemIdInputRef}
        />
      </Form.Group>
    </Form>
  );
}

export default CommentTask;
