import { Accordion, Button, Col, Form, Modal, Row } from "react-bootstrap";
import { StepTaskExtProps } from "../../stepTasks/StepTask/StepTask";
import TaskType from "../../../types/TaskType";
import { useEffect, useRef, useState } from "react";
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
