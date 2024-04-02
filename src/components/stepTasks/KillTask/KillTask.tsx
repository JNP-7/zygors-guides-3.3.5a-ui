import { Col, Form, Row } from "react-bootstrap";
import { TaskEditionUpdateProps } from "../../../types/CommonTaskProps";
import TaskType from "../../../types/TaskType";
import { StepTaskExtProps } from "../StepTask/StepTask";
import { useRef } from "react";
import { IEditableTaskProps } from "../../modals/TaskEditionModal/TaskEditionModal";
import { arrayContainsAll } from "../../../App";

export interface KillTaskEditableProps extends IEditableTaskProps {
  npcName: string;
  npcId?: number;
  count?: number;
  questId?: number;
  questObjectiveIndex?: number;
}

export interface KillTaskExtProps
  extends StepTaskExtProps,
    KillTaskEditableProps {}

interface KillTaskProps extends KillTaskExtProps {}

export function getKillTaskSummary(killTaskProps: KillTaskExtProps): string {
  let summary: string = "Kill ";
  if (killTaskProps.count !== undefined && killTaskProps.count > 0) {
    summary += `${killTaskProps.count} `;
  }
  summary += killTaskProps.npcName;
  return summary;
}

export function getDefaultKillTask(
  depth: number,
  subTasks: StepTaskExtProps[] = []
): KillTaskExtProps {
  return {
    npcName: "Some NPC",
    depth: depth,
    subTasks: subTasks,
    type: TaskType.KILL,
  };
}

export function buildKillTaskTranslation(
  guideObj: { text: string },
  taskProps: KillTaskExtProps,
  taskIdentation: string
) {
  guideObj.text += taskIdentation;
  guideObj.text += "kill ";
  if (taskProps.count !== undefined && taskProps.count > 1) {
    guideObj.text += taskProps.count + " ";
  }
  guideObj.text += taskProps.npcName;
  if (taskProps.npcId !== undefined) {
    guideObj.text += "##" + taskProps.npcId;
  }
  if (
    taskProps.questId !== undefined &&
    taskProps.questObjectiveIndex !== undefined
  ) {
    guideObj.text +=
      "|q " + taskProps.questId + "/" + taskProps.questObjectiveIndex;
  }
  guideObj.text += "\n";
}

export function checkEditableKillTaskProps(taskProps: KillTaskEditableProps) {
  let propsKeys = [
    "npcName",
    "npcId",
    "count",
    "questId",
    "questObjectiveIndex",
  ];
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
  if (taskProps.count !== undefined && typeof taskProps.count !== "number") {
    throw new Error();
  }
  if (
    taskProps.questId !== undefined &&
    typeof taskProps.questId !== "number"
  ) {
    throw new Error();
  }
  if (
    taskProps.questObjectiveIndex !== undefined &&
    typeof taskProps.questObjectiveIndex !== "number"
  ) {
    throw new Error();
  }
}

function KillTask(killProps: KillTaskProps) {
  return <p className="mb-0">{getKillTaskSummary(killProps)}</p>;
}

interface KillTaskEditionFormProps
  extends KillTaskEditableProps,
    TaskEditionUpdateProps {}

export function KillTaskEditionForm(
  killTaskEditionProps: KillTaskEditionFormProps
) {
  const npcNameInputRef = useRef<HTMLInputElement>(null);
  const npcIdInputRef = useRef<HTMLInputElement>(null);
  const countInputRef = useRef<HTMLInputElement>(null);
  const questIdInputRef = useRef<HTMLInputElement>(null);
  const questObjectiveIndexInputRef = useRef<HTMLInputElement>(null);

  function buildKillTaskProps(): KillTaskEditableProps {
    let taskProps: KillTaskEditableProps = {
      npcName:
        npcNameInputRef.current?.value !== undefined
          ? npcNameInputRef.current.value
          : "",
    };
    if (
      npcIdInputRef.current?.value !== undefined &&
      npcIdInputRef.current.value !== ""
    ) {
      taskProps.npcId = Number.parseInt(npcIdInputRef.current.value);
    }
    if (
      countInputRef.current?.value !== undefined &&
      countInputRef.current.value !== ""
    ) {
      taskProps.count = Number.parseInt(countInputRef.current.value);
    }
    if (
      questIdInputRef.current?.value !== undefined &&
      questIdInputRef.current.value !== ""
    ) {
      taskProps.questId = Number.parseInt(questIdInputRef.current.value);
    }
    if (
      questObjectiveIndexInputRef.current?.value !== undefined &&
      questObjectiveIndexInputRef.current.value !== ""
    ) {
      taskProps.questObjectiveIndex = Number.parseInt(
        questObjectiveIndexInputRef.current.value
      );
    }
    return taskProps;
  }

  function handleOnInputChange() {
    killTaskEditionProps.setProps(buildKillTaskProps());
  }

  return (
    <Form>
      <Form.Group className="mb-3">
        <Form.Label>NPC Name</Form.Label>
        <Form.Control
          type="text"
          placeholder="The NPC to kill"
          value={killTaskEditionProps.npcName}
          onChange={() => handleOnInputChange()}
          ref={npcNameInputRef}
        />
      </Form.Group>
      <Row className="mb-3">
        <Col xs={6}>
          <Form.Group>
            <Form.Label>NPC ID</Form.Label>
            <Form.Control
              type="number"
              placeholder="The NPC's ID"
              value={killTaskEditionProps.npcId?.toString() || ""}
              onChange={() => handleOnInputChange()}
              ref={npcIdInputRef}
            />
          </Form.Group>
        </Col>
        <Col xs={6}>
          <Form.Group>
            <Form.Label>Kill count</Form.Label>
            <Form.Control
              type="number"
              placeholder="How many?"
              value={killTaskEditionProps.count?.toString() || ""}
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
              placeholder="This kill task's quest ID"
              value={killTaskEditionProps.questId?.toString() || ""}
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
              value={killTaskEditionProps.questObjectiveIndex?.toString() || ""}
              onChange={() => handleOnInputChange()}
              ref={questObjectiveIndexInputRef}
              min={1}
            />
          </Form.Group>
        </Col>
      </Row>
    </Form>
  );
}

export default KillTask;
