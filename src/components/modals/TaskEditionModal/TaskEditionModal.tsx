import { Accordion, Button, Form, Modal } from "react-bootstrap";
import { StepTaskExtProps } from "../../stepTasks/StepTask/StepTask";
import TaskType from "../../../types/TaskType";
import { useEffect, useRef, useState } from "react";
import {
  GoToTaskEditionForm,
  GoToTaskExtProps,
} from "../../stepTasks/GoToTask/GoToTask";
import {
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
    useState<StepTaskExtProps>(taskCurrentProps);
  const advancedTextAreaRef = useRef<HTMLTextAreaElement>(null);

  function handleOnHide(isSaveProps: boolean) {
    if (onHide !== undefined) {
      onHide();
    }
    if (isSaveProps) {
      onSaveTaskProperties(inEditionTaskProps);
    }
    setShowVal(false);
  }

  function handleOnChangeProps(newProps: StepTaskExtProps) {
    setInEditionTaskProps(newProps);
    if (advancedTextAreaRef.current !== null) {
      advancedTextAreaRef.current.value = getBeautifiedInEditionProps();
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

  function getBeautifiedInEditionProps() {
    return JSON.stringify(inEditionTaskProps, null, "\t");
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
              <Form.Group>
                <Form.Control
                  as="textarea"
                  rows={10}
                  defaultValue={getBeautifiedInEditionProps()}
                  ref={advancedTextAreaRef}
                  onChange={() => {}}
                />
              </Form.Group>
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
