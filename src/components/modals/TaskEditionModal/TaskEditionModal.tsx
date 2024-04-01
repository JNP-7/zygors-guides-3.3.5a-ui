import { Accordion, Button, Col, Form, Modal, Row } from "react-bootstrap";
import { StepTaskExtProps } from "../../stepTasks/StepTask/StepTask";
import TaskType from "../../../types/TaskType";
import { useRef, useState } from "react";
import {
  GoToTaskEditableProps,
  GoToTaskEditionForm,
  GoToTaskExtProps,
} from "../../stepTasks/GoToTask/GoToTask";
import {
  CommentTaskEditableProps,
  CommentTaskEditionForm,
  CommentTaskExtProps,
} from "../../stepTasks/CommentTask/CommentTask";
import {
  TalkToTaskEditableProps,
  TalkToTaskEditionForm,
  TalkToTaskExtProps,
} from "../../stepTasks/TalkToTask/TalkToTask";
import {
  AcceptTaskEditableProps,
  AcceptTaskEditionForm,
  AcceptTaskExtProps,
} from "../../stepTasks/AcceptTask/AcceptTask";
import {
  TurnInTaskEditableProps,
  TurnInTaskEditionForm,
  TurnInTaskExtProps,
} from "../../stepTasks/TurnInTask/TurnInTask";
import {
  KillTaskEditableProps,
  KillTaskEditionForm,
  KillTaskExtProps,
} from "../../stepTasks/KillTask/KillTask";
import {
  GetTaskEditableProps,
  GetTaskEditionForm,
  GetTaskExtProps,
} from "../../stepTasks/GetTask/GetTask";
import {
  GoalTaskEditableProps,
  GoalTaskEditionForm,
  GoalTaskExtProps,
} from "../../stepTasks/GoalTask/GoalTask";

interface TaskEditionModalProps {
  taskType: TaskType;
  taskCurrentProps: StepTaskExtProps;
  showVal: boolean;
  onHide?: () => void;
  title: string;
  onSaveTaskProperties: (taskProps: StepTaskExtProps) => void;
  cancelText?: string;
  confirmText?: string;
  setShowVal: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface IEditableTaskProps {}

function TaskEditionModal({
  taskType,
  taskCurrentProps,
  showVal,
  onHide,
  title,
  onSaveTaskProperties,
  cancelText = "Cancel",
  confirmText = "Save",
  setShowVal,
}: TaskEditionModalProps) {
  const [inEditionTaskProps, setInEditionTaskProps] =
    useState<IEditableTaskProps>(
      getEditablePropsFromStepTaskProps(taskCurrentProps)
    );
  const advancedTextAreaRef = useRef<HTMLTextAreaElement>(null);

  function handleOnHide(isSaveProps: boolean) {
    if (onHide !== undefined) {
      onHide();
    }
    if (isSaveProps) {
      onSaveTaskProperties(
        getStepTaskPropsFromEditableProps(inEditionTaskProps)
      );
    }
    setShowVal(false);
  }

  function handleOnChangeProps(newProps: IEditableTaskProps) {
    setInEditionTaskProps(newProps);
    if (advancedTextAreaRef.current !== null) {
      advancedTextAreaRef.current.value = getBeautifiedInEditionProps(newProps);
    }
  }

  function handleOnOverrideEditableProps() {
    if (advancedTextAreaRef.current !== null) {
      try {
        switch (taskCurrentProps.type) {
          case TaskType.COMMENT:
            setInEditionTaskProps(
              JSON.parse(
                advancedTextAreaRef.current.value
              ) as CommentTaskEditableProps
            );
            break;
          case TaskType.GOTO:
            let goToProps: GoToTaskEditableProps = JSON.parse(
              advancedTextAreaRef.current.value
            ) as GoToTaskEditableProps;
            goToProps.xCoord = Math.round(goToProps.xCoord * 100) / 100;
            goToProps.yCoord = Math.round(goToProps.yCoord * 100) / 100;
            setInEditionTaskProps(goToProps);
            break;
          case TaskType.TALKTO:
            setInEditionTaskProps(
              JSON.parse(
                advancedTextAreaRef.current.value
              ) as TalkToTaskEditableProps
            );
            break;
          case TaskType.ACCEPTQ:
            setInEditionTaskProps(
              JSON.parse(
                advancedTextAreaRef.current.value
              ) as AcceptTaskEditableProps
            );
            break;
          case TaskType.TURNINQ:
            setInEditionTaskProps(
              JSON.parse(
                advancedTextAreaRef.current.value
              ) as TurnInTaskEditableProps
            );
            break;
          case TaskType.KILL:
            setInEditionTaskProps(
              JSON.parse(
                advancedTextAreaRef.current.value
              ) as KillTaskEditableProps
            );
            break;
          case TaskType.GET:
            setInEditionTaskProps(
              JSON.parse(
                advancedTextAreaRef.current.value
              ) as GetTaskEditableProps
            );
            break;
          case TaskType.GOAL:
            setInEditionTaskProps(
              JSON.parse(
                advancedTextAreaRef.current.value
              ) as GoalTaskEditableProps
            );
            break;
        }
      } catch (e) {
        console.error(e);
        alert("Format not valid for this type of task");
      }
    }
  }

  function getEditablePropsFromStepTaskProps(
    stepTaskProps: StepTaskExtProps
  ): IEditableTaskProps {
    switch (taskCurrentProps.type) {
      case TaskType.COMMENT:
        let commentProps: CommentTaskExtProps =
          stepTaskProps as CommentTaskExtProps;
        let editableCommentProps: CommentTaskEditableProps = {
          comment: commentProps.comment,
          itemId: commentProps.itemId,
          itemName: commentProps.itemName,
        };
        return editableCommentProps;
      case TaskType.GOTO:
        let goToProps: GoToTaskExtProps = stepTaskProps as GoToTaskExtProps;
        let editableGoToProps: GoToTaskEditableProps = {
          coordsMap: goToProps.coordsMap,
          xCoord: goToProps.xCoord,
          yCoord: goToProps.yCoord,
          comment: goToProps.comment,
          itemId: goToProps.itemId,
          itemName: goToProps.itemName,
        };
        return editableGoToProps;
      case TaskType.TALKTO:
        let talkToProps: TalkToTaskExtProps =
          stepTaskProps as TalkToTaskExtProps;
        let editableTalkToProps: TalkToTaskEditableProps = {
          npcName: talkToProps.npcName,
          npcId: talkToProps.npcId,
        };
        return editableTalkToProps;
      case TaskType.ACCEPTQ:
        let acceptQProps: AcceptTaskExtProps =
          stepTaskProps as AcceptTaskExtProps;
        let editableAcceptQProps: AcceptTaskEditableProps = {
          questName: acceptQProps.questName,
          questId: acceptQProps.questId,
        };
        return editableAcceptQProps;
      case TaskType.TURNINQ:
        let turnInQProps: TurnInTaskExtProps =
          stepTaskProps as TurnInTaskExtProps;
        let editableTurnInQProps: TurnInTaskEditableProps = {
          questName: turnInQProps.questName,
          questId: turnInQProps.questId,
        };
        return editableTurnInQProps;
      case TaskType.KILL:
        let killProps: KillTaskExtProps = stepTaskProps as KillTaskExtProps;
        let editableKillProps: KillTaskEditableProps = {
          npcName: killProps.npcName,
          npcId: killProps.npcId,
          count: killProps.count,
          questId: killProps.questId,
          questObjectiveIndex: killProps.questObjectiveIndex,
        };
        return editableKillProps;
      case TaskType.GET:
        let getProps: GetTaskExtProps = stepTaskProps as GetTaskExtProps;
        let editableGetProps: GetTaskEditableProps = {
          itemName: getProps.itemName,
          count: getProps.count,
          questId: getProps.questId,
          questObjectiveIndex: getProps.questObjectiveIndex,
          toLootNpcs: getProps.toLootNpcs,
        };
        return editableGetProps;
      case TaskType.GOAL:
        let goalProps: GoalTaskExtProps = stepTaskProps as GoalTaskExtProps;
        let editableGoalProps: GoalTaskEditableProps = {
          goalName: goalProps.goalName,
          count: goalProps.count,
          comment: goalProps.comment,
          questId: goalProps.questId,
          questObjectiveIndex: goalProps.questObjectiveIndex,
        };
        return editableGoalProps;
    }
  }

  function getStepTaskPropsFromEditableProps(
    editableProps: IEditableTaskProps
  ): StepTaskExtProps {
    switch (taskCurrentProps.type) {
      case TaskType.COMMENT:
        let editableCommentProps: CommentTaskEditableProps =
          editableProps as CommentTaskEditableProps;
        let commentProps: CommentTaskExtProps = {
          ...editableCommentProps,
          depth: taskCurrentProps.depth,
          type: taskCurrentProps.type,
          subTasks: taskCurrentProps.subTasks,
        };
        return commentProps;
      case TaskType.GOTO:
        let editableGoToProps: GoToTaskEditableProps =
          editableProps as GoToTaskEditableProps;
        let goToProps: GoToTaskExtProps = {
          ...editableGoToProps,
          depth: taskCurrentProps.depth,
          type: taskCurrentProps.type,
          subTasks: taskCurrentProps.subTasks,
        };
        return goToProps;
      case TaskType.TALKTO:
        let editableTalkToProps: TalkToTaskEditableProps =
          editableProps as TalkToTaskEditableProps;
        let talkToProps: TalkToTaskExtProps = {
          ...editableTalkToProps,
          depth: taskCurrentProps.depth,
          type: taskCurrentProps.type,
          subTasks: taskCurrentProps.subTasks,
        };
        return talkToProps;
      case TaskType.ACCEPTQ:
        let editableAcceptQProps: AcceptTaskEditableProps =
          editableProps as AcceptTaskEditableProps;
        let acceptQProps: AcceptTaskExtProps = {
          ...editableAcceptQProps,
          depth: taskCurrentProps.depth,
          type: taskCurrentProps.type,
          subTasks: taskCurrentProps.subTasks,
        };
        return acceptQProps;
      case TaskType.TURNINQ:
        let editableTurnInQProps: TurnInTaskEditableProps =
          editableProps as TurnInTaskEditableProps;
        let turnInQProps: TurnInTaskExtProps = {
          ...editableTurnInQProps,
          depth: taskCurrentProps.depth,
          type: taskCurrentProps.type,
          subTasks: taskCurrentProps.subTasks,
        };
        return turnInQProps;
      case TaskType.KILL:
        let editableKillProps: KillTaskEditableProps =
          editableProps as KillTaskEditableProps;
        let killProps: KillTaskExtProps = {
          ...editableKillProps,
          depth: taskCurrentProps.depth,
          type: taskCurrentProps.type,
          subTasks: taskCurrentProps.subTasks,
        };
        return killProps;
      case TaskType.GET:
        let editableGetProps: GetTaskEditableProps =
          editableProps as GetTaskEditableProps;
        let getProps: GetTaskExtProps = {
          ...editableGetProps,
          depth: taskCurrentProps.depth,
          type: taskCurrentProps.type,
          subTasks: taskCurrentProps.subTasks,
        };
        return getProps;
      case TaskType.GOAL:
        let editableGoalProps: GoalTaskEditableProps =
          editableProps as GoalTaskEditableProps;
        let goalProps: GoalTaskExtProps = {
          ...editableGoalProps,
          depth: taskCurrentProps.depth,
          type: taskCurrentProps.type,
          subTasks: taskCurrentProps.subTasks,
        };
        return goalProps;
    }
  }

  function getTaskEditionFormComponent(): JSX.Element {
    switch (taskType) {
      case TaskType.COMMENT:
        let inEditionCommentProps = inEditionTaskProps as CommentTaskExtProps;
        return (
          <CommentTaskEditionForm
            {...inEditionCommentProps}
            setProps={handleOnChangeProps}
          />
        );
      case TaskType.GOTO:
        let inEditionGoToProps = inEditionTaskProps as GoToTaskExtProps;
        return (
          <GoToTaskEditionForm
            {...inEditionGoToProps}
            setProps={handleOnChangeProps}
          />
        );
      case TaskType.TALKTO:
        let inEditionTalkToProps = inEditionTaskProps as TalkToTaskExtProps;
        return (
          <TalkToTaskEditionForm
            {...inEditionTalkToProps}
            setProps={handleOnChangeProps}
          />
        );
      case TaskType.ACCEPTQ:
        let inEditionAcceptProps = inEditionTaskProps as AcceptTaskExtProps;
        return (
          <AcceptTaskEditionForm
            {...inEditionAcceptProps}
            setProps={handleOnChangeProps}
          />
        );
      case TaskType.TURNINQ:
        let inEditionTurnInProps = inEditionTaskProps as TurnInTaskExtProps;
        return (
          <TurnInTaskEditionForm
            {...inEditionTurnInProps}
            setProps={handleOnChangeProps}
          />
        );
      case TaskType.KILL:
        let inEditionKillProps = inEditionTaskProps as KillTaskExtProps;
        return (
          <KillTaskEditionForm
            {...inEditionKillProps}
            setProps={handleOnChangeProps}
          />
        );
      case TaskType.GET:
        let inEditionGetProps = inEditionTaskProps as GetTaskExtProps;
        return (
          <GetTaskEditionForm
            {...inEditionGetProps}
            setProps={handleOnChangeProps}
          />
        );
      case TaskType.GOAL:
        let inEditionGoalProps = inEditionTaskProps as GoalTaskExtProps;
        return (
          <GoalTaskEditionForm
            {...inEditionGoalProps}
            setProps={handleOnChangeProps}
          />
        );
    }
  }

  function getBeautifiedInEditionProps(updatedProps?: IEditableTaskProps) {
    return updatedProps !== undefined
      ? JSON.stringify(updatedProps, null, "\t")
      : JSON.stringify(inEditionTaskProps, null, "\t");
  }

  return (
    <Modal
      backdrop="static"
      animation={false}
      show={showVal}
      onHide={() => handleOnHide(false)}
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {getTaskEditionFormComponent()}
        <Accordion>
          <Accordion.Item eventKey="advancedEditionInput">
            <Accordion.Header>Advanced</Accordion.Header>
            <Accordion.Body>
              <Form.Group className="mb-3">
                <Form.Control
                  as="textarea"
                  rows={10}
                  defaultValue={getBeautifiedInEditionProps()}
                  ref={advancedTextAreaRef}
                />
              </Form.Group>
              <Row>
                <Col xs={12} className="d-flex-full-center">
                  <Button
                    title="Override the task properties"
                    onClick={() => handleOnOverrideEditableProps()}
                    variant="primary"
                  >
                    Override
                  </Button>
                </Col>
              </Row>
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => handleOnHide(false)}>
          {cancelText}
        </Button>
        <Button variant="primary" onClick={() => handleOnHide(true)}>
          {confirmText}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default TaskEditionModal;
