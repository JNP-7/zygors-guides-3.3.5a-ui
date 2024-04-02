import { Form } from "react-bootstrap";
import { TaskEditionUpdateProps } from "../../../types/CommonTaskProps";
import TaskType from "../../../types/TaskType";
import { StepTaskExtProps } from "../StepTask/StepTask";
import { useRef } from "react";
import { IEditableTaskProps } from "../../modals/TaskEditionModal/TaskEditionModal";
import { arrayContainsAll } from "../../../App";

export interface TalkToTaskEditableProps extends IEditableTaskProps {
  npcName: string;
  npcId?: number;
}

export interface TalkToTaskExtProps
  extends StepTaskExtProps,
    TalkToTaskEditableProps {}

interface TalkToTaskProps extends TalkToTaskExtProps {}

export function getTalkToTaskSummary(
  talkToTaskProps: TalkToTaskExtProps
): string {
  return `Talk to ${talkToTaskProps.npcName}`;
}

export function getDefaultTalkToTask(
  depth: number,
  subTasks: StepTaskExtProps[] = []
): TalkToTaskExtProps {
  return {
    npcName: "Some NPC",
    depth: depth,
    subTasks: subTasks,
    type: TaskType.TALKTO,
  };
}

export function buildTalkToTaskTranslation(
  guideObj: { text: string },
  taskProps: TalkToTaskExtProps,
  taskIdentation: string
) {
  guideObj.text += taskIdentation;
  guideObj.text +=
    "talk " +
    taskProps.npcName +
    (taskProps.npcId !== undefined ? "##" + taskProps.npcId : "");
  guideObj.text += "\n";
}

export function checkEditableTalkToTaskProps(
  taskProps: TalkToTaskEditableProps
) {
  let propsKeys = ["npcName", "npcId"];
  if (!arrayContainsAll(propsKeys, Object.keys(taskProps))) {
    throw new Error();
  }
  if (
    taskProps.npcName === undefined ||
    typeof taskProps.npcName !== "string"
  ) {
    throw new Error();
  }
  if (taskProps.npcId !== undefined && typeof taskProps.npcId !== "number") {
    throw new Error();
  }
}

function TalkToTask(talkToProps: TalkToTaskProps) {
  return <p className="mb-0">{getTalkToTaskSummary(talkToProps)}</p>;
}

interface TalkToTaskEditionFormProps
  extends TalkToTaskEditableProps,
    TaskEditionUpdateProps {}

export function TalkToTaskEditionForm(
  talkToTaskEditionProps: TalkToTaskEditionFormProps
) {
  const npcNameInputRef = useRef<HTMLInputElement>(null);
  const npcIdInputRef = useRef<HTMLInputElement>(null);

  function buildTalkToTaskProps(): TalkToTaskEditableProps {
    let taskProps: TalkToTaskEditableProps = {
      npcName:
        npcNameInputRef.current?.value !== undefined
          ? npcNameInputRef.current.value
          : "Some NPC",
    };
    if (
      npcIdInputRef.current?.value !== undefined &&
      npcIdInputRef.current.value !== ""
    ) {
      taskProps.npcId = Number.parseInt(npcIdInputRef.current.value);
    }
    return taskProps;
  }

  function handleOnInputChange() {
    talkToTaskEditionProps.setProps(buildTalkToTaskProps());
  }

  return (
    <Form>
      <Form.Group className="mb-3">
        <Form.Label>NPC name</Form.Label>
        <Form.Control
          type="text"
          placeholder="The NPC's name"
          value={talkToTaskEditionProps.npcName}
          onChange={() => handleOnInputChange()}
          ref={npcNameInputRef}
        />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>NPC id (recommended)</Form.Label>
        <Form.Control
          type="number"
          placeholder="The NPC's id"
          value={talkToTaskEditionProps.npcId?.toString() || ""}
          onChange={() => handleOnInputChange()}
          ref={npcIdInputRef}
        />
      </Form.Group>
    </Form>
  );
}

export default TalkToTask;
