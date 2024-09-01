import { Form } from "react-bootstrap";
import {
  ItemUsageTaskProps,
  TaskEditionUpdateProps,
} from "../../../types/CommonTaskProps";
import TaskType from "../../../types/TaskType";
import { StepTaskExtProps } from "../StepTask/StepTask";
import { useRef } from "react";
import { IEditableTaskProps } from "../../modals/TaskEditionModal/TaskEditionModal";
import { arrayContainsAll, isBlank } from "../../../App";
import GuideTranslationType from "../../../types/GuideTranslationType";

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
  subTasks: StepTaskExtProps[] = [],
  isCustom: boolean
): CommentTaskExtProps {
  return {
    comment: "Do something",
    depth: depth,
    subTasks: subTasks,
    type: TaskType.COMMENT,
    isCustom: isCustom,
  };
}

export function buildCommentTaskTranslation(
  guideObj: { text: string },
  taskProps: CommentTaskExtProps,
  taskIdentation: string,
  translationType: GuideTranslationType
) {
  if (
    translationType == GuideTranslationType.FULL ||
    (translationType == GuideTranslationType.CUSTOM_TO_TEXT &&
      !taskProps.isCustom)
  ) {
    buildCommentTaskRegularTranslation(guideObj, taskProps, taskIdentation);
  } else {
    buildCommentTaskTextTranslation(guideObj, taskProps, taskIdentation);
  }
}

function buildCommentTaskRegularTranslation(
  guideObj: { text: string },
  taskProps: CommentTaskExtProps,
  taskIdentation: string
) {
  let itemUsageText = "";
  if (!isBlank(taskProps.itemName)) {
    itemUsageText +=
      `use ${taskProps.itemName}` +
      (taskProps.itemId !== undefined ? `##${taskProps.itemId}` : "");
  }
  guideObj.text += taskIdentation + `'${taskProps.comment}`;
  if (!isBlank(itemUsageText)) {
    guideObj.text += `|${itemUsageText}`;
  }
  guideObj.text += "|c";
  guideObj.text += "\n";
}

function buildCommentTaskTextTranslation(
  guideObj: { text: string },
  taskProps: CommentTaskExtProps,
  taskIdentation: string
) {
  let itemUsageText = "";
  if (!isBlank(taskProps.itemName)) {
    itemUsageText += `. Use ${taskProps.itemName}`;
  }
  guideObj.text += taskIdentation + `'${taskProps.comment}`;
  if (!isBlank(itemUsageText)) {
    guideObj.text += itemUsageText;
  }
  guideObj.text += "|c";
  guideObj.text += "\n";
}

export function checkEditableCommentTaskProps(
  taskProps: CommentTaskEditableProps
) {
  let propsKeys = ["comment", "itemId", "itemName"];
  if (!arrayContainsAll(propsKeys, Object.keys(taskProps))) {
    throw new Error();
  }
  if (
    taskProps.comment === undefined ||
    typeof taskProps.comment !== "string"
  ) {
    throw new Error();
  }
  if (taskProps.itemId !== undefined && typeof taskProps.itemId !== "number") {
    throw new Error();
  }
  if (
    taskProps.itemName !== undefined &&
    typeof taskProps.itemName !== "string"
  ) {
    throw new Error();
  }
}

function CommentTask(commentProps: CommentTaskProps) {
  return (
    <p className="mb-0 one-line-ellipsis task-summary">
      {getCommentTaskSummary(commentProps)}
    </p>
  );
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
