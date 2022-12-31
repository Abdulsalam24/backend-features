import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

function ModalConfirm() {
  return (
    <div
      className="modal show"
      style={{ display: "block", position: "initial" }}
    >
      <Modal.Dialog>
        <Modal.Header closeButton>
          <Modal.Title>Delete Confirmation</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <p>Are you sure you want to delete this post?</p>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary">Cancel</Button>
          <Button variant="primary">Delete</Button>
        </Modal.Footer>
      </Modal.Dialog>
    </div>
  );
}

export default ModalConfirm;
