import { Button, Modal } from "react-bootstrap";

interface ConfirmationModalProps {
  showVal: boolean;
  onHide?: () => void;
  title?: string;
  bodyText: string;
  onConfirmation: () => void;
  cancelText?: string;
  confirmText?: string;
  setShowVal: React.Dispatch<React.SetStateAction<boolean>>;
}

function ConfirmationModal({
  showVal,
  onHide,
  title = "Are you sure?",
  bodyText,
  onConfirmation,
  cancelText = "Cancel",
  confirmText = "Yes",
  setShowVal,
}: ConfirmationModalProps) {
  function handleOnHide(isConfirm: boolean) {
    if (onHide !== undefined) {
      onHide();
    }
    if (isConfirm) {
      onConfirmation();
    }
    setShowVal(false);
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
      <Modal.Body>{bodyText}</Modal.Body>
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

export default ConfirmationModal;
