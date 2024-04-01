import ListGroup from "react-bootstrap/ListGroup";
import {
  GuidesWorkspaceContext,
  GuidesWorkspaceContextAccessor,
} from "../../GuidesWorkspace/GuidesWorkspace";
import TaskType, {
  getTaskTypeDescription,
  getTaskTypeOrdinal,
} from "../../../types/TaskType";
import { GuideExtProps } from "../../Guide/Guide";
import CommentTask, {
  CommentTaskExtProps,
  buildCommentTaskTranslation,
  getCommentTaskSummary,
  getDefaultCommentTask,
} from "../CommentTask/CommentTask";
import { useContext, useState } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import {
  BoxArrowDownRight,
  Dash,
  PencilFill,
  Plus,
} from "react-bootstrap-icons";
import { stepIsMaxedOutOnTasks } from "../../SectionStep/SectionStep";
import GoToTask, {
  GoToTaskExtProps,
  buildGoToTaskTranslation,
  getDefaultGoToTask,
  getGoToTaskSummary,
} from "../GoToTask/GoToTask";
import ConfirmationModal from "../../modals/ConfirmationModal/ConfirmationModal";
import TaskEditionModal from "../../modals/TaskEditionModal/TaskEditionModal";
import TalkToTask, {
  TalkToTaskExtProps,
  buildTalkToTaskTranslation,
  getDefaultTalkToTask,
  getTalkToTaskSummary,
} from "../TalkToTask/TalkToTask";
import AcceptTask, {
  AcceptTaskExtProps,
  buildAcceptTaskTranslation,
  getAcceptTaskSummary,
  getDefaultAcceptTask,
} from "../AcceptTask/AcceptTask";
import TurnInTask, {
  TurnInTaskExtProps,
  buildTurnInTaskTranslation,
  getDefaultTurnInTask,
  getTurnInTaskSummary,
} from "../TurnInTask/TurnInTask";
import KillTask, {
  KillTaskExtProps,
  buildKillTaskTranslation,
  getDefaultKillTask,
  getKillTaskSummary,
} from "../KillTask/KillTask";
import GetTask, {
  GetTaskExtProps,
  buildGetTaskTranslation,
  getDefaultGetTask,
  getGetTaskSummary,
} from "../GetTask/GetTask";
import GoalTask, {
  GoalTaskExtProps,
  buildGoalTaskTranslation,
  getDefaultGoalTask,
  getGoalTaskSummary,
} from "../GoalTask/GoalTask";

export interface StepTaskExtProps {
  depth: number;
  type: TaskType;
  subTasks: StepTaskExtProps[];
}
/*
  Starts at 0, and ends in 2 (total = 3). 
  Haven't seen tasks of more depth in any of the Zygor's guides
*/
export const MAX_TASK_DEPTH = 2;

export interface StepTaskProps
  extends StepTaskExtProps,
    GuidesWorkspaceContextAccessor {}

export function getTaskSummary(
  guidesContext: GuideExtProps[],
  indexPathToTask: number[],
  taskDepth: number
): string {
  let targetTask = getTargetTask(guidesContext, indexPathToTask, taskDepth);

  switch (targetTask.type) {
    case TaskType.COMMENT:
      return getCommentTaskSummary(targetTask as CommentTaskExtProps);
    case TaskType.GOTO:
      return getGoToTaskSummary(targetTask as GoToTaskExtProps);
    case TaskType.TALKTO:
      return getTalkToTaskSummary(targetTask as TalkToTaskExtProps);
    case TaskType.ACCEPTQ:
      return getAcceptTaskSummary(targetTask as AcceptTaskExtProps);
    case TaskType.TURNINQ:
      return getTurnInTaskSummary(targetTask as TurnInTaskExtProps);
    case TaskType.KILL:
      return getKillTaskSummary(targetTask as KillTaskExtProps);
    case TaskType.GET:
      return getGetTaskSummary(targetTask as GetTaskExtProps);
    case TaskType.GOAL:
      return getGoalTaskSummary(targetTask as GoalTaskExtProps);
  }
}

export function getTargetTask(
  guidesContext: GuideExtProps[],
  indexPathToTask: number[],
  taskDepth: number
): StepTaskExtProps {
  let stepTasks: StepTaskExtProps[] =
    guidesContext[indexPathToTask[0]].guideSections[indexPathToTask[1]]
      .sectionSteps[indexPathToTask[2]].stepTasks;

  let targetTask: StepTaskExtProps = stepTasks[indexPathToTask[3]];

  for (let nextDepth = 1; nextDepth <= taskDepth; nextDepth++) {
    targetTask = targetTask.subTasks[indexPathToTask[3 + nextDepth]];
  }

  return targetTask;
}

export function getTargetTaskList(
  guidesContext: GuideExtProps[],
  indexPathToTask: number[],
  taskDepth: number
): StepTaskExtProps[] {
  let stepTasks: StepTaskExtProps[] =
    guidesContext[indexPathToTask[0]].guideSections[indexPathToTask[1]]
      .sectionSteps[indexPathToTask[2]].stepTasks;

  for (let nextDepth = 1; nextDepth <= taskDepth; nextDepth++) {
    stepTasks = stepTasks[indexPathToTask[3 + nextDepth - 1]].subTasks;
  }

  return stepTasks;
}

export function buildTaskTranslation(
  guideObj: { text: string },
  taskProps: StepTaskExtProps
) {
  let taskIdentation = getTaskIdentation(taskProps.depth);
  switch (taskProps.type) {
    case TaskType.COMMENT:
      buildCommentTaskTranslation(
        guideObj,
        taskProps as CommentTaskExtProps,
        taskIdentation
      );
      break;
    case TaskType.GOTO:
      buildGoToTaskTranslation(
        guideObj,
        taskProps as GoToTaskExtProps,
        taskIdentation
      );
      break;
    case TaskType.TALKTO:
      buildTalkToTaskTranslation(
        guideObj,
        taskProps as TalkToTaskExtProps,
        taskIdentation
      );
      break;
    case TaskType.ACCEPTQ:
      buildAcceptTaskTranslation(
        guideObj,
        taskProps as AcceptTaskExtProps,
        taskIdentation
      );
      break;
    case TaskType.TURNINQ:
      buildTurnInTaskTranslation(
        guideObj,
        taskProps as TurnInTaskExtProps,
        taskIdentation
      );
      break;
    case TaskType.KILL:
      buildKillTaskTranslation(
        guideObj,
        taskProps as KillTaskExtProps,
        taskIdentation
      );
      break;
    case TaskType.GET:
      buildGetTaskTranslation(
        guideObj,
        taskProps as GetTaskExtProps,
        taskIdentation
      );
      break;
    case TaskType.GOAL:
      buildGoalTaskTranslation(
        guideObj,
        taskProps as GoalTaskExtProps,
        taskIdentation
      );
      break;
  }
  taskProps.subTasks.forEach((nextSubTask) => {
    buildTaskTranslation(guideObj, nextSubTask);
  });
}

function getTaskIdentation(taskDepth: number): string {
  let identation: string = "\t\t";
  for (let i = 0; i < taskDepth - 1; i++) {
    identation += ".";
  }
  return identation;
}

function StepTask({ depth, type, subTasks, indexPath }: StepTaskProps) {
  const guidesContext = useContext(GuidesWorkspaceContext);
  const [confirmModalIsVisible, setConfirmModalIsVisible] = useState(false);
  const [taskEditionModalIsVisible, setTaskEditionModalIsVisible] =
    useState(false);

  let isMaxedOutStep = stepIsMaxedOutOnTasks(
    indexPath,
    guidesContext.guidesContext
  );

  function handleOnRemoveTask() {
    guidesContext.setGuidesContext((guides) => {
      let targetTaskList = getTargetTaskList(guides, indexPath, depth);
      targetTaskList.splice(indexPath[3 + depth], 1);
    });
  }

  function handleOnAddSubtasksList() {
    guidesContext.setGuidesContext((guides) => {
      let targetTask = getTargetTask(guides, indexPath, depth);
      targetTask.subTasks.splice(0, 0, getDefaultCommentTask(depth + 1));
    });
  }

  function handleOnAddTask() {
    guidesContext.setGuidesContext((guides) => {
      let targetTaskList = getTargetTaskList(guides, indexPath, depth);
      targetTaskList.splice(
        indexPath[3 + depth] + 1,
        0,
        getDefaultCommentTask(depth)
      );
    });
  }

  function handleOnEditTask(taskProps: StepTaskExtProps) {
    guidesContext.setGuidesContext((guides) => {
      let targetTaskList = getTargetTaskList(guides, indexPath, depth);
      targetTaskList[indexPath[3 + depth]] = taskProps;
    });
  }

  function handleOnTaskTypeChange(typeVal: string) {
    let newStepTaskType: TaskType =
      Object.values(TaskType)[Number.parseInt(typeVal)];
    let newStepTaskProps: StepTaskExtProps;
    switch (newStepTaskType) {
      case TaskType.COMMENT:
        newStepTaskProps = getDefaultCommentTask(depth, subTasks);
        break;
      case TaskType.GOTO:
        newStepTaskProps = getDefaultGoToTask(depth, subTasks);
        break;
      case TaskType.TALKTO:
        newStepTaskProps = getDefaultTalkToTask(depth, subTasks);
        break;
      case TaskType.ACCEPTQ:
        newStepTaskProps = getDefaultAcceptTask(depth, subTasks);
        break;
      case TaskType.TURNINQ:
        newStepTaskProps = getDefaultTurnInTask(depth, subTasks);
        break;
      case TaskType.KILL:
        newStepTaskProps = getDefaultKillTask(depth, subTasks);
        break;
      case TaskType.GET:
        newStepTaskProps = getDefaultGetTask(depth, subTasks);
        break;
      case TaskType.GOAL:
        newStepTaskProps = getDefaultGoalTask(depth, subTasks);
        break;
    }
    guidesContext.setGuidesContext((guides) => {
      let targetTaskList = getTargetTaskList(guides, indexPath, depth);
      targetTaskList.splice(indexPath[3 + depth], 1, newStepTaskProps);
    });
  }

  function getStepTaskNode(): JSX.Element {
    let currentTask = getTargetTask(
      guidesContext.guidesContext,
      indexPath,
      depth
    );

    switch (type) {
      case TaskType.COMMENT:
        let currentCommentTask = currentTask as CommentTaskExtProps;
        return (
          <CommentTask
            comment={currentCommentTask.comment}
            depth={currentCommentTask.depth}
            subTasks={currentCommentTask.subTasks}
            type={currentCommentTask.type}
            itemId={currentCommentTask.itemId}
            itemName={currentCommentTask.itemName}
          ></CommentTask>
        );
      case TaskType.GOTO:
        let currentGoToTask = currentTask as GoToTaskExtProps;
        return (
          <GoToTask
            coordsMap={currentGoToTask.coordsMap}
            depth={currentGoToTask.depth}
            subTasks={currentGoToTask.subTasks}
            type={currentGoToTask.type}
            xCoord={currentGoToTask.xCoord}
            yCoord={currentGoToTask.yCoord}
            comment={currentGoToTask.comment}
            itemId={currentGoToTask.itemId}
            itemName={currentGoToTask.itemName}
          ></GoToTask>
        );
      case TaskType.TALKTO:
        let currentTalkToTask = currentTask as TalkToTaskExtProps;
        return (
          <TalkToTask
            npcName={currentTalkToTask.npcName}
            npcId={currentTalkToTask.npcId}
            depth={currentTalkToTask.depth}
            subTasks={currentTalkToTask.subTasks}
            type={currentTalkToTask.type}
          ></TalkToTask>
        );
      case TaskType.ACCEPTQ:
        let currentAcceptTask = currentTask as AcceptTaskExtProps;
        return (
          <AcceptTask
            questName={currentAcceptTask.questName}
            questId={currentAcceptTask.questId}
            depth={currentAcceptTask.depth}
            subTasks={currentAcceptTask.subTasks}
            type={currentAcceptTask.type}
          ></AcceptTask>
        );
      case TaskType.TURNINQ:
        let currentTurnInTask = currentTask as TurnInTaskExtProps;
        return (
          <TurnInTask
            questName={currentTurnInTask.questName}
            questId={currentTurnInTask.questId}
            depth={currentTurnInTask.depth}
            subTasks={currentTurnInTask.subTasks}
            type={currentTurnInTask.type}
          ></TurnInTask>
        );
      case TaskType.KILL:
        let currentKillTask = currentTask as KillTaskExtProps;
        return (
          <KillTask
            npcName={currentKillTask.npcName}
            npcId={currentKillTask.questId}
            count={currentKillTask.count}
            questId={currentKillTask.questId}
            questObjectiveIndex={currentKillTask.questObjectiveIndex}
            depth={currentKillTask.depth}
            subTasks={currentKillTask.subTasks}
            type={currentKillTask.type}
          ></KillTask>
        );
      case TaskType.GET:
        let currentGetTask = currentTask as GetTaskExtProps;
        return (
          <GetTask
            itemName={currentGetTask.itemName}
            count={currentGetTask.count}
            questId={currentGetTask.questId}
            questObjectiveIndex={currentGetTask.questObjectiveIndex}
            toLootNpcs={currentGetTask.toLootNpcs}
            depth={currentGetTask.depth}
            subTasks={currentGetTask.subTasks}
            type={currentGetTask.type}
          ></GetTask>
        );
      case TaskType.GOAL:
        let currentGoalTask = currentTask as GoalTaskExtProps;
        return (
          <GoalTask
            goalName={currentGoalTask.goalName}
            count={currentGoalTask.count}
            comment={currentGoalTask.comment}
            questId={currentGoalTask.questId}
            questObjectiveIndex={currentGoalTask.questObjectiveIndex}
            depth={currentGoalTask.depth}
            subTasks={currentGoalTask.subTasks}
            type={currentGoalTask.type}
          ></GoalTask>
        );
    }
  }

  function getStepTaskIndexText(): string {
    let indexText: string = `${indexPath[2] + 1}.`;
    indexText += `${indexPath[3] + 1}`;
    for (let nextDepth: number = 1; nextDepth <= depth; nextDepth++) {
      indexText += `.${indexPath[3 + nextDepth] + 1}`;
    }
    return indexText;
  }

  function isOnlyFirstLevelTask() {
    return (
      depth === 0 &&
      guidesContext.guidesContext[indexPath[0]].guideSections[indexPath[1]]
        .sectionSteps[indexPath[2]].stepTasks.length <= 1
    );
  }

  return (
    <>
      <ListGroup.Item as="li" className="task-container">
        <Row className="align-items-center">
          <Col xs="auto">
            <span>{getStepTaskIndexText()}</span>
          </Col>
          <Col xs="auto">{getStepTaskNode()}</Col>
          <Col xs="auto" className="d-flex align-items-center ms-auto">
            <Form.Label className="col-form-label me-2">{`Task type: `}</Form.Label>
            <Form.Group className="me-2">
              <Form.Select
                aria-label="Type of this task"
                onChange={(e) => handleOnTaskTypeChange(e.target.value)}
                value={getTaskTypeOrdinal(type)}
              >
                {Object.entries(TaskType).map((nextTaskType) => {
                  return (
                    <option
                      key={getTaskTypeOrdinal(nextTaskType[1]).toString()}
                      value={getTaskTypeOrdinal(nextTaskType[1]).toString()}
                      title={getTaskTypeDescription(nextTaskType[1])}
                    >
                      {nextTaskType[1]}
                    </option>
                  );
                })}
              </Form.Select>
            </Form.Group>
            <Button
              className="p-1 d-flex-full-center"
              variant="primary"
              title="Edit task"
              onClick={() => setTaskEditionModalIsVisible(true)}
            >
              <PencilFill size="1.75rem" />
            </Button>
          </Col>
        </Row>
        <div className="task-creation-buttons-container">
          <Button
            title="Add subtask"
            size="sm"
            variant="secondary"
            disabled={
              isMaxedOutStep || subTasks.length > 0 || depth >= MAX_TASK_DEPTH
            }
            onClick={() => handleOnAddSubtasksList()}
          >
            <BoxArrowDownRight />
          </Button>
          <Button
            title="Add task"
            size="sm"
            variant="primary"
            className="ms-1"
            disabled={isMaxedOutStep}
            onClick={() => handleOnAddTask()}
          >
            <Plus />
          </Button>
          <Button
            title="Remove this task"
            size="sm"
            variant="danger"
            className="ms-1"
            disabled={isOnlyFirstLevelTask()}
            onClick={() => setConfirmModalIsVisible(true)}
          >
            <Dash />
          </Button>
        </div>
        {subTasks.length > 0 && (
          <ListGroup as="ul" className="step-tasks-container">
            {subTasks.map((nextSubtask, index) => (
              <StepTask
                key={index}
                depth={nextSubtask.depth}
                subTasks={nextSubtask.subTasks}
                indexPath={indexPath.concat(index)}
                type={nextSubtask.type}
              ></StepTask>
            ))}
          </ListGroup>
        )}
      </ListGroup.Item>
      <ConfirmationModal
        onConfirmation={handleOnRemoveTask}
        bodyText="This task and any tasks that depend on it will be deleted."
        setShowVal={setConfirmModalIsVisible}
        showVal={confirmModalIsVisible}
      />
      <TaskEditionModal
        key={new Date().getTime()} //To force a reset of the modal's state each time it opens
        taskCurrentProps={getTargetTask(
          guidesContext.guidesContext,
          indexPath,
          depth
        )}
        taskType={type}
        setShowVal={setTaskEditionModalIsVisible}
        showVal={taskEditionModalIsVisible}
        title={`Editing  ${""} task ${getStepTaskIndexText()}`}
        onSaveTaskProperties={handleOnEditTask}
      />
    </>
  );
}

export default StepTask;
