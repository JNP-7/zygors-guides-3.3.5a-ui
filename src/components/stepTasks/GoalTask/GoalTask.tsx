import { Col, Form, Row } from "react-bootstrap";
import { TaskEditionUpdateProps } from "../../../types/CommonTaskProps";
import TaskType from "../../../types/TaskType";
import { StepTaskExtProps } from "../StepTask/StepTask";
import { useRef } from "react";
import { IEditableTaskProps } from "../../modals/TaskEditionModal/TaskEditionModal";
import { arrayContainsAll, isBlank } from "../../../App";

export interface GoalTaskEditableProps extends IEditableTaskProps {
  goalName: string;
  comment?: string;
  count?: number;
  questId: number;
  questObjectiveIndex: number;
}

export interface GoalTaskExtProps
  extends StepTaskExtProps,
    GoalTaskEditableProps {}

interface GoalTaskProps extends GoalTaskExtProps {}

export function getGoalTaskSummary(goalTaskProps: GoalTaskExtProps): string {
  let summary: string = "Complete ";
  if (goalTaskProps.count !== undefined && goalTaskProps.count > 0) {
    summary += `${goalTaskProps.count} `;
  }
  summary += goalTaskProps.goalName;
  return summary;
}

export function getDefaultGoalTask(
  depth: number,
  subTasks: StepTaskExtProps[] = []
): GoalTaskExtProps {
  return {
    goalName: "Some objective",
    questId: 0,
    questObjectiveIndex: 1,
    depth: depth,
    subTasks: subTasks,
    type: TaskType.GOAL,
  };
}

export function buildGoalTaskTranslation(
  guideObj: { text: string },
  taskProps: GoalTaskExtProps,
  taskIdentation: string
) {
  guideObj.text += taskIdentation;
  if (!isBlank(taskProps.comment)) {
    guideObj.text += "'" + taskProps.comment + "|";
  }
  guideObj.text += "goal ";
  if (taskProps.count !== undefined && taskProps.count > 1) {
    guideObj.text += taskProps.count + " ";
  }
  guideObj.text += taskProps.goalName;
  if (
    taskProps.questId !== undefined &&
    taskProps.questObjectiveIndex !== undefined
  ) {
    guideObj.text +=
      "|q " + taskProps.questId + "/" + taskProps.questObjectiveIndex;
  }
  guideObj.text += "\n";
}

export function checkEditableGoalTaskProps(taskProps: GoalTaskEditableProps) {
  let propsKeys = [
    "goalName",
    "comment",
    "count",
    "questId",
    "questObjectiveIndex",
  ];
  if (!arrayContainsAll(propsKeys, Object.keys(taskProps))) {
    throw new Error();
  }
  if (
    taskProps.goalName === undefined ||
    typeof taskProps.goalName !== "string"
  ) {
    throw new Error();
  }
  if (
    taskProps.comment === undefined &&
    typeof taskProps.comment !== "string"
  ) {
    throw new Error();
  }
  if (taskProps.count !== undefined && typeof taskProps.count !== "number") {
    throw new Error();
  }
  if (
    taskProps.questId === undefined ||
    typeof taskProps.questId !== "number"
  ) {
    throw new Error();
  }
  if (
    taskProps.questObjectiveIndex === undefined ||
    typeof taskProps.questObjectiveIndex !== "number"
  ) {
    throw new Error();
  }
}

function GoalTask(goalProps: GoalTaskProps) {
  return (
    <p className="mb-0 one-line-ellipsis task-summary">
      {getGoalTaskSummary(goalProps)}
    </p>
  );
}

interface GoalTaskEditionFormProps
  extends GoalTaskEditableProps,
    TaskEditionUpdateProps {}

export function GoalTaskEditionForm(
  goalTaskEditionProps: GoalTaskEditionFormProps
) {
  const goalNameInputRef = useRef<HTMLInputElement>(null);
  const commentInputRef = useRef<HTMLInputElement>(null);
  const countInputRef = useRef<HTMLInputElement>(null);
  const questIdInputRef = useRef<HTMLInputElement>(null);
  const questObjectiveIndexInputRef = useRef<HTMLInputElement>(null);

  function buildGoalTaskProps(): GoalTaskEditableProps {
    let taskProps: GoalTaskEditableProps = {
      goalName:
        goalNameInputRef.current?.value !== undefined
          ? goalNameInputRef.current.value
          : "",
      questId:
        questIdInputRef.current?.value !== undefined &&
        !isNaN(Number.parseFloat(questIdInputRef.current.value))
          ? Number.parseFloat(questIdInputRef.current.value)
          : 0,
      questObjectiveIndex:
        questObjectiveIndexInputRef.current?.value !== undefined &&
        !isNaN(Number.parseFloat(questObjectiveIndexInputRef.current.value))
          ? Number.parseFloat(questObjectiveIndexInputRef.current.value)
          : 1,
    };
    if (
      countInputRef.current?.value !== undefined &&
      countInputRef.current.value !== ""
    ) {
      taskProps.count = Number.parseInt(countInputRef.current.value);
    }
    if (
      commentInputRef.current?.value !== undefined &&
      commentInputRef.current?.value !== ""
    ) {
      taskProps.comment = commentInputRef.current.value;
    }
    return taskProps;
  }

  function handleOnInputChange() {
    goalTaskEditionProps.setProps(buildGoalTaskProps());
  }

  return (
    <Form>
      <Row className="mb-3">
        <Col xs={6}>
          <Form.Group>
            <Form.Label>Goal Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="A description of the goal"
              value={goalTaskEditionProps.goalName}
              onChange={() => handleOnInputChange()}
              ref={goalNameInputRef}
            />
          </Form.Group>
        </Col>
        <Col xs={6}>
          <Form.Group>
            <Form.Label>Goal count</Form.Label>
            <Form.Control
              type="number"
              placeholder="How many times?"
              value={goalTaskEditionProps.count?.toString() || ""}
              onChange={() => handleOnInputChange()}
              ref={countInputRef}
              min={1}
            />
          </Form.Group>
        </Col>
      </Row>
      <Row className="mb-3">
        <Col xs={6}>
          <Form.Group>
            <Form.Label>Quest id</Form.Label>
            <Form.Control
              type="number"
              placeholder="This goal task's quest ID"
              value={goalTaskEditionProps.questId.toString()}
              onChange={() => handleOnInputChange()}
              ref={questIdInputRef}
            />
          </Form.Group>
        </Col>
        <Col xs={6}>
          <Form.Group>
            <Form.Label>Quest objective index</Form.Label>
            <Form.Control
              type="number"
              placeholder="Objective 1,2,3..."
              value={goalTaskEditionProps.questObjectiveIndex.toString()}
              onChange={() => handleOnInputChange()}
              ref={questObjectiveIndexInputRef}
              min={1}
            />
          </Form.Group>
        </Col>
      </Row>
      <Form.Group className="mb-3">
        <Form.Label>Comment</Form.Label>
        <Form.Control
          type="text"
          placeholder="The message for this task"
          value={goalTaskEditionProps.comment || ""}
          onChange={() => handleOnInputChange()}
          ref={commentInputRef}
        />
      </Form.Group>
    </Form>
  );
}

export default GoalTask;
