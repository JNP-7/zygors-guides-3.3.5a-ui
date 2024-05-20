import { Form } from "react-bootstrap";
import { TaskEditionUpdateProps } from "../../../types/CommonTaskProps";
import TaskType from "../../../types/TaskType";
import { StepTaskExtProps } from "../StepTask/StepTask";
import { useRef } from "react";
import { IEditableTaskProps } from "../../modals/TaskEditionModal/TaskEditionModal";
import { arrayContainsAll, isBlank } from "../../../App";

export interface TurnInTaskEditableProps extends IEditableTaskProps {
  questName?: string;
  questId: number;
}

export interface TurnInTaskExtProps
  extends StepTaskExtProps,
    TurnInTaskEditableProps {}

interface TurnInTaskProps extends TurnInTaskExtProps {}

export function getTurnInTaskSummary(
  turnInTaskProps: TurnInTaskExtProps
): string {
  let questMessage: string = "Turn in ";
  if (
    turnInTaskProps.questName !== undefined &&
    turnInTaskProps.questName !== ""
  ) {
    questMessage += turnInTaskProps.questName;
  } else {
    questMessage += "q#" + turnInTaskProps.questId;
  }
  return questMessage;
}

export function getDefaultTurnInTask(
  depth: number,
  subTasks: StepTaskExtProps[] = [],
  isCustom: boolean
): TurnInTaskExtProps {
  return {
    questName: "Some quest",
    questId: 0,
    depth: depth,
    subTasks: subTasks,
    type: TaskType.TURNINQ,
    isCustom: isCustom,
  };
}

export function buildTurnInTaskTranslation(
  guideObj: { text: string },
  taskProps: TurnInTaskExtProps,
  taskIdentation: string
) {
  guideObj.text +=
    taskIdentation +
    "turnin " +
    (!isBlank(taskProps.questName) ? taskProps.questName : "") +
    "##" +
    taskProps.questId +
    "\n";
}

export function checkEditableTurnInTaskProps(
  taskProps: TurnInTaskEditableProps
) {
  let propsKeys = ["questId", "questName"];
  if (!arrayContainsAll(propsKeys, Object.keys(taskProps))) {
    throw new Error();
  }
  if (
    taskProps.questId === undefined ||
    typeof taskProps.questId !== "number"
  ) {
    throw new Error();
  }
  if (
    taskProps.questName !== undefined &&
    typeof taskProps.questName !== "string"
  ) {
    throw new Error();
  }
}

function TurnInTask(turnInProps: TurnInTaskProps) {
  return (
    <p className="mb-0 one-line-ellipsis task-summary">
      {getTurnInTaskSummary(turnInProps)}
    </p>
  );
}

interface TurnInTaskEditionFormProps
  extends TurnInTaskEditableProps,
    TaskEditionUpdateProps {}

export function TurnInTaskEditionForm(
  turnInTaskEditionProps: TurnInTaskEditionFormProps
) {
  const qNameInputRef = useRef<HTMLInputElement>(null);
  const qIdInputRef = useRef<HTMLInputElement>(null);

  function buildTurnInTaskProps(): TurnInTaskEditableProps {
    let taskProps: TurnInTaskEditableProps = {
      questId:
        qIdInputRef.current?.value !== undefined &&
        !isNaN(Number.parseFloat(qIdInputRef.current.value))
          ? Number.parseFloat(qIdInputRef.current.value)
          : 0,
    };
    if (
      qNameInputRef.current?.value !== undefined &&
      qNameInputRef.current.value !== ""
    ) {
      taskProps.questName = qNameInputRef.current.value;
    }
    return taskProps;
  }

  function handleOnInputChange() {
    turnInTaskEditionProps.setProps(buildTurnInTaskProps());
  }

  return (
    <Form>
      <Form.Group className="mb-3">
        <Form.Label>Quest name</Form.Label>
        <Form.Control
          type="text"
          placeholder="The message for this task"
          value={turnInTaskEditionProps.questName || ""}
          onChange={() => handleOnInputChange()}
          ref={qNameInputRef}
        />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>{`Quest id (recommended)`}</Form.Label>
        <Form.Control
          type="number"
          placeholder="The quest's id"
          value={turnInTaskEditionProps.questId}
          onChange={() => handleOnInputChange()}
          ref={qIdInputRef}
        />
      </Form.Group>
    </Form>
  );
}

export default TurnInTask;
