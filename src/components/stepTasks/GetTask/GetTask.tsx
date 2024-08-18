import { Button, Col, Form, Row } from "react-bootstrap";
import { TaskEditionUpdateProps } from "../../../types/CommonTaskProps";
import TaskType from "../../../types/TaskType";
import { StepTaskExtProps } from "../StepTask/StepTask";
import { useRef } from "react";
import { IEditableTaskProps } from "../../modals/TaskEditionModal/TaskEditionModal";
import { Dash } from "react-bootstrap-icons";
import { arrayContainsAll, isBlank } from "../../../App";
import GuideTranslationType from "../../../types/GuideTranslationType";

export interface ToLootNPC {
  npcName: string;
  npcId: number;
}

export interface GetTaskEditableProps extends IEditableTaskProps {
  itemName: string;
  count?: number;
  questId: number;
  questObjectiveIndex: number;
  toLootNpcs: ToLootNPC[];
}

export interface GetTaskExtProps
  extends StepTaskExtProps,
    GetTaskEditableProps {}

interface GetTaskProps extends GetTaskExtProps {}

export function getGetTaskSummary(getTaskProps: GetTaskExtProps): string {
  let summary: string = "Get ";
  if (getTaskProps.count !== undefined && getTaskProps.count > 0) {
    summary += `${getTaskProps.count} `;
  }
  summary += getTaskProps.itemName;
  return summary;
}

export function getDefaultGetTask(
  depth: number,
  subTasks: StepTaskExtProps[] = [],
  isCustom: boolean
): GetTaskExtProps {
  return {
    itemName: "Some item",
    questId: 0,
    questObjectiveIndex: 1,
    toLootNpcs: [],
    depth: depth,
    subTasks: subTasks,
    type: TaskType.GET,
    isCustom: isCustom,
  };
}

export function buildGetTaskTranslation(
  guideObj: { text: string },
  taskProps: GetTaskExtProps,
  taskIdentation: string,
  translationType: GuideTranslationType
) {
  if (
    translationType == GuideTranslationType.FULL ||
    (translationType == GuideTranslationType.CUSTOM_TO_TEXT &&
      !taskProps.isCustom)
  ) {
    buildGetTaskRegularTranslation(guideObj, taskProps, taskIdentation);
  } else {
    buildGetTaskTextTranslation(guideObj, taskProps, taskIdentation);
  }
}

function buildGetTaskRegularTranslation(
  guideObj: { text: string },
  taskProps: GetTaskExtProps,
  taskIdentation: string
) {
  let toLootNpcsText = "";
  let addedToLootNpcs = 0;
  taskProps.toLootNpcs.forEach((toLootNpc) => {
    if (!isBlank(toLootNpc.npcName) && toLootNpc.npcId !== undefined) {
      if (addedToLootNpcs > 0) {
        toLootNpcsText += ", ";
      }
      toLootNpcsText += toLootNpc.npcName + "##" + toLootNpc.npcId;
      addedToLootNpcs++;
    }
  });
  if (!isBlank(toLootNpcsText)) {
    guideObj.text += taskIdentation + "from " + toLootNpcsText + "\n";
  }

  guideObj.text += taskIdentation + "get ";
  if (taskProps.count !== undefined && taskProps.count > 1) {
    guideObj.text += taskProps.count + " ";
  }
  guideObj.text += taskProps.itemName;
  if (
    taskProps.questId !== undefined &&
    taskProps.questObjectiveIndex !== undefined
  ) {
    guideObj.text +=
      "|q " + taskProps.questId + "/" + taskProps.questObjectiveIndex;
  }
  guideObj.text += "\n";
}

function buildGetTaskTextTranslation(
  guideObj: { text: string },
  taskProps: GetTaskExtProps,
  taskIdentation: string
) {
  guideObj.text += taskIdentation + "'Get ";
  if (taskProps.count !== undefined && taskProps.count > 1) {
    guideObj.text += taskProps.count + " ";
  }
  guideObj.text += taskProps.itemName;

  let toLootNpcsText = "";
  let addedToLootNpcs = 0;
  taskProps.toLootNpcs.forEach((toLootNpc) => {
    if (!isBlank(toLootNpc.npcName) && toLootNpc.npcId !== undefined) {
      if (addedToLootNpcs > 0) {
        toLootNpcsText += ", ";
      }
      toLootNpcsText += toLootNpc.npcName + "(id:" + toLootNpc.npcId + ")";
      addedToLootNpcs++;
    }
  });

  if (!isBlank(toLootNpcsText)) {
    guideObj.text += taskIdentation + " from " + toLootNpcsText;
  }

  if (
    taskProps.questId !== undefined &&
    taskProps.questObjectiveIndex !== undefined
  ) {
    guideObj.text +=
      " for a quest (id:" +
      taskProps.questId +
      ", objective:" +
      taskProps.questObjectiveIndex +
      ")";
  }
  guideObj.text += "\n";
}

export function checkEditableGetTaskProps(taskProps: GetTaskEditableProps) {
  let propsKeys = [
    "itemName",
    "count",
    "questId",
    "questObjectiveIndex",
    "toLootNpcs",
  ];
  if (!arrayContainsAll(propsKeys, Object.keys(taskProps))) {
    throw new Error();
  }
  if (
    taskProps.itemName === undefined ||
    typeof taskProps.itemName !== "string"
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
  if (
    taskProps.toLootNpcs === undefined ||
    typeof taskProps.toLootNpcs !== "object"
  ) {
    throw new Error();
  } else {
    let toLootNpcsKeys = ["npcId", "npcName"];
    taskProps.toLootNpcs.forEach((nextNpc) => {
      if (nextNpc === undefined || typeof nextNpc !== "object") {
        throw new Error();
      } else {
        if (!arrayContainsAll(toLootNpcsKeys, Object.keys(nextNpc))) {
          throw new Error();
        }
        if (nextNpc.npcId === undefined || typeof nextNpc.npcId !== "number") {
          throw new Error();
        }
        if (
          nextNpc.npcName === undefined ||
          typeof nextNpc.npcName !== "string"
        ) {
          throw new Error();
        }
      }
    });
  }
}

function GetTask(getProps: GetTaskProps) {
  return (
    <p className="mb-0 one-line-ellipsis task-summary">
      {getGetTaskSummary(getProps)}
    </p>
  );
}

interface GetTaskEditionFormProps
  extends GetTaskEditableProps,
    TaskEditionUpdateProps {}

export function GetTaskEditionForm(
  getTaskEditionProps: GetTaskEditionFormProps
) {
  const itemNameInputRef = useRef<HTMLInputElement>(null);
  const countInputRef = useRef<HTMLInputElement>(null);
  const questIdInputRef = useRef<HTMLInputElement>(null);
  const questObjectiveIndexInputRef = useRef<HTMLInputElement>(null);
  const toLootNpcsListRef = useRef<HTMLUListElement>(null);

  function getLootNpcsOfList(
    npcsList: HTMLUListElement,
    indexToRemove: number
  ): ToLootNPC[] {
    let npcList: ToLootNPC[] = [];
    let npcEntry = npcsList.querySelectorAll<HTMLLIElement>(
      ".get-task-edit-form-loot-npcs-entry"
    );
    npcEntry.forEach((nextNpcEntry, index) => {
      if (index !== indexToRemove) {
        let nextNameInput = nextNpcEntry.querySelector<HTMLInputElement>(
          ".get-task-edit-form-loot-npcs-name-input"
        );
        let nextIdInput = nextNpcEntry.querySelector<HTMLInputElement>(
          ".get-task-edit-form-loot-npcs-id-input"
        );
        if (nextNameInput !== null && nextIdInput !== null) {
          npcList.push({
            npcName: nextNameInput.value,
            npcId: !isNaN(Number.parseFloat(nextIdInput.value))
              ? Number.parseFloat(nextIdInput.value)
              : 0,
          });
        } else {
          npcList.push({
            npcName: "",
            npcId: 0,
          });
        }
      }
    });

    return npcList;
  }

  function buildGetTaskProps(
    addLottableNPC: boolean = false,
    indexToRemove: number = -1
  ): GetTaskEditableProps {
    let taskProps: GetTaskEditableProps = {
      itemName:
        itemNameInputRef.current?.value !== undefined
          ? itemNameInputRef.current.value
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
      toLootNpcs:
        toLootNpcsListRef.current !== null
          ? getLootNpcsOfList(toLootNpcsListRef.current, indexToRemove)
          : [],
    };
    //Builds adding an extra empty lootable NPC
    if (addLottableNPC) {
      taskProps.toLootNpcs.push({
        npcName: "",
        npcId: 0,
      });
    }
    if (
      countInputRef.current?.value !== undefined &&
      countInputRef.current.value !== ""
    ) {
      taskProps.count = Number.parseInt(countInputRef.current.value);
    }
    return taskProps;
  }

  function handleOnInputChange(
    addLottableNPC: boolean = false,
    indexToRemove: number = -1
  ) {
    getTaskEditionProps.setProps(
      buildGetTaskProps(addLottableNPC, indexToRemove)
    );
  }

  function handleOnAddLootableNPC() {
    handleOnInputChange(true);
  }

  function handleOnDeleteLootableNPC(indexToDelete: number) {
    handleOnInputChange(false, indexToDelete);
  }

  return (
    <Form className="get-task-edit-form">
      <Row className="mb-3">
        <Col xs={6}>
          <Form.Group>
            <Form.Label>Item Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="The item to get"
              value={getTaskEditionProps.itemName}
              onChange={() => handleOnInputChange()}
              ref={itemNameInputRef}
            />
          </Form.Group>
        </Col>
        <Col xs={6}>
          <Form.Group>
            <Form.Label>Ammount</Form.Label>
            <Form.Control
              type="number"
              placeholder="How many?"
              value={getTaskEditionProps.count?.toString() || ""}
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
              placeholder="This fetch task's quest ID"
              value={getTaskEditionProps.questId.toString()}
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
              value={getTaskEditionProps.questObjectiveIndex.toString()}
              onChange={() => handleOnInputChange()}
              ref={questObjectiveIndexInputRef}
              min={1}
            />
          </Form.Group>
        </Col>
      </Row>
      <Row className="mb-3">
        <Col xs={12}>
          <Button
            variant="primary"
            size="sm"
            title="Add an NPC that drops the item"
            onClick={() => handleOnAddLootableNPC()}
          >
            Add lootable NPC
          </Button>
          <ul
            className="get-task-edit-form-loot-npcs-list"
            ref={toLootNpcsListRef}
          >
            {getTaskEditionProps.toLootNpcs.map((nextNpc, index) => {
              return (
                <Row
                  as="li"
                  key={index}
                  className="get-task-edit-form-loot-npcs-entry"
                >
                  <Col xs="auto">
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => handleOnDeleteLootableNPC(index)}
                      title="Remove this NPC"
                    >
                      <Dash />
                    </Button>
                  </Col>
                  <Col xs={5}>
                    <Form.Group>
                      <Form.Label>NPC Name</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="NPC name"
                        value={nextNpc.npcName}
                        onChange={() => handleOnInputChange()}
                        className="get-task-edit-form-loot-npcs-name-input"
                      />
                    </Form.Group>
                  </Col>
                  <Col xs={5}>
                    <Form.Group>
                      <Form.Label>NPC ID</Form.Label>
                      <Form.Control
                        type="number"
                        placeholder="The NPC's ID'"
                        value={nextNpc.npcId}
                        onChange={() => handleOnInputChange()}
                        className="get-task-edit-form-loot-npcs-id-input"
                      />
                    </Form.Group>
                  </Col>
                </Row>
              );
            })}
          </ul>
        </Col>
      </Row>
    </Form>
  );
}

export default GetTask;
