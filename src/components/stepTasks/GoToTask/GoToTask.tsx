import { useRef } from "react";
import {
  ItemUsageTaskProps,
  TaskEditionUpdateProps,
  getItemUsageSummary,
} from "../../../types/CommonTaskProps";
import CoordinatesMap from "../../../types/CoordinatesMap";
import TaskType from "../../../types/TaskType";
import { IEditableTaskProps } from "../../modals/TaskEditionModal/TaskEditionModal";
import { StepTaskExtProps } from "../StepTask/StepTask";
import { Col, Form, Row } from "react-bootstrap";
import { arrayContainsAll, isBlank } from "../../../App";
import GuideTranslationType from "../../../types/GuideTranslationType";

export const DEFAULT_COORDS_MAP_INDEX = -1;
export const DEFAULT_COORDS_MAP = {
  text: "Current map",
  index: DEFAULT_COORDS_MAP_INDEX,
};

const MAX_GOTO_SUMMARY_COMMENT_LENGTH = 30;

export interface GoToTaskEditableProps
  extends IEditableTaskProps,
    ItemUsageTaskProps {
  comment?: string;
  xCoord: number;
  yCoord: number;
  coordsMap: string;
}

export interface GoToTaskExtProps
  extends StepTaskExtProps,
    GoToTaskEditableProps {}

interface GoToTaskProps extends GoToTaskExtProps {}

export function getGoToTaskSummary(goToTaskProps: GoToTaskExtProps): string {
  let formattedComment = "";
  if (goToTaskProps.comment !== undefined) {
    formattedComment =
      goToTaskProps.comment.length > MAX_GOTO_SUMMARY_COMMENT_LENGTH
        ? goToTaskProps.comment
            .substring(0, MAX_GOTO_SUMMARY_COMMENT_LENGTH)
            .concat("...")
        : goToTaskProps.comment;
    formattedComment += ", ";
  }
  let coordsMsg = "Go to ";
  if (goToTaskProps.coordsMap !== DEFAULT_COORDS_MAP.text) {
    coordsMsg += goToTaskProps.coordsMap + " ";
  }
  coordsMsg += `[${goToTaskProps.xCoord},${goToTaskProps.yCoord}]`;
  let itemUsageSummary = getItemUsageSummary(goToTaskProps, false);
  return `${formattedComment}${coordsMsg}${
    itemUsageSummary !== "" ? ` and ${itemUsageSummary}` : ""
  }`;
}

export function getDefaultGoToTask(
  depth: number,
  subTasks: StepTaskExtProps[] = [],
  isCustom: boolean
): GoToTaskExtProps {
  return {
    xCoord: 0.0,
    yCoord: 0.0,
    depth: depth,
    subTasks: subTasks,
    type: TaskType.GOTO,
    coordsMap: DEFAULT_COORDS_MAP.text,
    isCustom: isCustom,
  };
}

export function buildGoToTaskTranslation(
  guideObj: { text: string },
  taskProps: GoToTaskExtProps,
  taskIdentation: string,
  translationType: GuideTranslationType
) {
  if (
    translationType == GuideTranslationType.FULL ||
    (translationType == GuideTranslationType.CUSTOM_TO_TEXT &&
      !taskProps.isCustom)
  ) {
    buildGoToTaskRegularTranslation(guideObj, taskProps, taskIdentation);
  } else {
    buildGoToTaskTextTranslation(guideObj, taskProps, taskIdentation);
  }
}

function buildGoToTaskRegularTranslation(
  guideObj: { text: string },
  taskProps: GoToTaskExtProps,
  taskIdentation: string
) {
  guideObj.text += taskIdentation;
  if (!isBlank(taskProps.comment)) {
    guideObj.text += "'" + taskProps.comment + "|";
  }

  guideObj.text +=
    "goto " +
    (taskProps.coordsMap !== DEFAULT_COORDS_MAP.text
      ? taskProps.coordsMap + ","
      : "") +
    taskProps.xCoord +
    "," +
    taskProps.yCoord;

  let itemUsageText = "";
  if (!isBlank(taskProps.itemName)) {
    itemUsageText +=
      `use ${taskProps.itemName}` +
      (taskProps.itemId !== undefined ? `##${taskProps.itemId}` : "");
  }
  if (!isBlank(itemUsageText)) {
    guideObj.text += `|${itemUsageText}`;
  }

  guideObj.text += "\n";
}

function buildGoToTaskTextTranslation(
  guideObj: { text: string },
  taskProps: GoToTaskExtProps,
  taskIdentation: string
) {
  let commentText = "";
  if (!isBlank(taskProps.comment)) {
    commentText += "'" + taskProps.comment;
  }

  if (!isBlank(taskProps.itemName)) {
    if (!isBlank(commentText)) {
      commentText += `. Use ${taskProps.itemName}`;
    } else {
      commentText += `'Use ${taskProps.itemName}`;
    }
  }

  guideObj.text += taskIdentation;
  if (!isBlank(commentText)) {
    guideObj.text += commentText + ". ";
  }

  guideObj.text +=
    "Go to " +
    (taskProps.coordsMap !== DEFAULT_COORDS_MAP.text
      ? taskProps.coordsMap + " "
      : "") +
    taskProps.xCoord +
    "," +
    taskProps.yCoord;

  guideObj.text += "\n";
}

export function checkEditableGoToTaskProps(taskProps: GoToTaskEditableProps) {
  let propsKeys = [
    "xCoord",
    "yCoord",
    "coordsMap",
    "comment",
    "itemId",
    "itemName",
  ];
  if (!arrayContainsAll(propsKeys, Object.keys(taskProps))) {
    throw new Error();
  }
  if (taskProps.xCoord === undefined || typeof taskProps.xCoord !== "number") {
    throw new Error();
  }
  if (taskProps.yCoord === undefined || typeof taskProps.yCoord !== "number") {
    throw new Error();
  }
  if (
    taskProps.coordsMap === undefined ||
    typeof taskProps.coordsMap !== "string"
  ) {
    throw new Error();
  }
  if (
    taskProps.comment !== undefined &&
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

function GoToTask(goToTaskProps: GoToTaskProps) {
  return (
    <p className="mb-0 one-line-ellipsis task-summary">
      {getGoToTaskSummary(goToTaskProps)}
    </p>
  );
}

interface GoToTaskEditionFormProps
  extends GoToTaskEditableProps,
    TaskEditionUpdateProps {}

export function GoToTaskEditionForm(
  goToTaskEditionProps: GoToTaskEditionFormProps
) {
  const commentInputRef = useRef<HTMLInputElement>(null);
  const xCoordInputRef = useRef<HTMLInputElement>(null);
  const yCoordInputRef = useRef<HTMLInputElement>(null);
  const coordsMapSelectRef = useRef<HTMLSelectElement>(null);
  const itemNameInputRef = useRef<HTMLInputElement>(null);
  const itemIdInputRef = useRef<HTMLInputElement>(null);

  function buildGoToTaskProps(): GoToTaskEditableProps {
    let taskProps: GoToTaskEditableProps = {
      xCoord:
        xCoordInputRef.current?.value !== undefined &&
        !isNaN(Number.parseFloat(xCoordInputRef.current.value))
          ? Math.round(Number.parseFloat(xCoordInputRef.current.value) * 100) /
            100
          : 0,
      yCoord:
        yCoordInputRef.current?.value !== undefined &&
        !isNaN(Number.parseFloat(yCoordInputRef.current.value))
          ? Math.round(Number.parseFloat(yCoordInputRef.current.value) * 100) /
            100
          : 0,
      coordsMap:
        coordsMapSelectRef.current?.value !== undefined
          ? coordsMapSelectRef.current.value
          : DEFAULT_COORDS_MAP.text,
    };
    if (
      commentInputRef.current?.value !== undefined &&
      commentInputRef.current?.value !== ""
    ) {
      taskProps.comment = commentInputRef.current.value;
    }
    if (
      itemIdInputRef.current?.value !== undefined &&
      itemIdInputRef.current?.value !== ""
    ) {
      taskProps.itemId = Number.parseInt(itemIdInputRef.current?.value);
    }
    if (
      itemNameInputRef.current?.value !== undefined &&
      itemNameInputRef.current?.value !== ""
    ) {
      taskProps.itemName = itemNameInputRef.current?.value;
    }
    return taskProps;
  }

  function handleOnInputChange() {
    goToTaskEditionProps.setProps(buildGoToTaskProps());
  }
  return (
    <Form>
      <Row>
        <Col xs={6} className="mb-3">
          <Form.Group>
            <Form.Label>X Coord.</Form.Label>
            <Form.Control
              type="number"
              placeholder="The X coordinate of this waypoint"
              value={goToTaskEditionProps.xCoord.toString()}
              onChange={() => handleOnInputChange()}
              ref={xCoordInputRef}
            />
          </Form.Group>
        </Col>
        <Col xs={6} className="mb-3">
          <Form.Group>
            <Form.Label>Y Coord.</Form.Label>
            <Form.Control
              type="number"
              placeholder="The Y coordinate of this waypoint"
              value={goToTaskEditionProps.yCoord.toString()}
              onChange={() => handleOnInputChange()}
              ref={yCoordInputRef}
            />
          </Form.Group>
        </Col>
      </Row>
      <Form.Group className="mb-3">
        <Form.Label>Map</Form.Label>
        <Form.Select
          value={goToTaskEditionProps.coordsMap}
          onChange={() => handleOnInputChange()}
          ref={coordsMapSelectRef}
        >
          <option
            value={DEFAULT_COORDS_MAP.text}
            key={DEFAULT_COORDS_MAP.index}
          >
            {DEFAULT_COORDS_MAP.text}
          </option>
          {Object.values(CoordinatesMap).map((nextMap, index) => {
            return (
              <option key={index} value={nextMap}>
                {nextMap}
              </option>
            );
          })}
        </Form.Select>
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Comment</Form.Label>
        <Form.Control
          type="text"
          placeholder="The message for this task"
          value={goToTaskEditionProps.comment || ""}
          onChange={() => handleOnInputChange()}
          ref={commentInputRef}
        />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Item name</Form.Label>
        <Form.Control
          type="text"
          placeholder="The name of the item to use"
          value={goToTaskEditionProps.itemName || ""}
          onChange={() => handleOnInputChange()}
          ref={itemNameInputRef}
        />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Item id</Form.Label>
        <Form.Control
          type="number"
          placeholder="The item's id"
          value={goToTaskEditionProps.itemId?.toString() || ""}
          onChange={() => handleOnInputChange()}
          ref={itemIdInputRef}
        />
      </Form.Group>
    </Form>
  );
}

export default GoToTask;
