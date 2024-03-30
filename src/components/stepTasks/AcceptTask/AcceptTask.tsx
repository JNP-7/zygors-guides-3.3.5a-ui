import { Form } from "react-bootstrap";
import { TaskEditionUpdateProps } from "../../../types/CommonTaskProps";
import TaskType from "../../../types/TaskType";
import { StepTaskExtProps } from "../StepTask/StepTask";
import { useRef } from "react";
import { IEditableTaskProps } from "../../modals/TaskEditionModal/TaskEditionModal";

export interface AcceptTaskEditableProps extends IEditableTaskProps {
  questName?: string;
  questId: number;
}

export interface AcceptTaskExtProps
  extends StepTaskExtProps,
    AcceptTaskEditableProps {}

interface AcceptTaskProps extends AcceptTaskExtProps {}

export function getAcceptTaskSummary(
  acceptTaskProps: AcceptTaskExtProps
): string {
  let questMessage: string = "Accept ";
  if (
    acceptTaskProps.questName !== undefined &&
    acceptTaskProps.questName !== ""
  ) {
    questMessage += acceptTaskProps.questName;
  } else {
    questMessage += "q#" + acceptTaskProps.questId;
  }
  return questMessage;
}

export function getDefaultAcceptTask(
  depth: number,
  subTasks: StepTaskExtProps[] = []
): AcceptTaskExtProps {
  return {
    questName: "Some quest",
    questId: 0,
    depth: depth,
    subTasks: subTasks,
    type: TaskType.ACCEPTQ,
  };
}

function AcceptTask(acceptProps: AcceptTaskProps) {
  return <p className="mb-0">{getAcceptTaskSummary(acceptProps)}</p>;
}

interface AcceptTaskEditionFormProps
  extends AcceptTaskEditableProps,
    TaskEditionUpdateProps {}

export function AcceptTaskEditionForm(
  acceptTaskEditionProps: AcceptTaskEditionFormProps
) {
  const qNameInputRef = useRef<HTMLInputElement>(null);
  const qIdInputRef = useRef<HTMLInputElement>(null);

  function buildAcceptTaskProps(): AcceptTaskEditableProps {
    let taskProps: AcceptTaskEditableProps = {
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
    acceptTaskEditionProps.setProps(buildAcceptTaskProps());
  }

  return (
    <Form>
      <Form.Group className="mb-3">
        <Form.Label>Quest name</Form.Label>
        <Form.Control
          type="text"
          placeholder="The message for this task"
          value={acceptTaskEditionProps.questName || ""}
          onChange={() => handleOnInputChange()}
          ref={qNameInputRef}
        />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>{`Quest id (recommended)`}</Form.Label>
        <Form.Control
          type="number"
          placeholder="The quest's id"
          value={acceptTaskEditionProps.questId}
          onChange={() => handleOnInputChange()}
          ref={qIdInputRef}
        />
      </Form.Group>
    </Form>
  );
}

export default AcceptTask;
