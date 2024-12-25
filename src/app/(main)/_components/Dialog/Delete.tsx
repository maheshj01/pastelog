import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@nextui-org/react";
import React from "react";
import { useSidebar } from "../../_hooks/useSidebar";

interface DeleteDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onDelete: (deleteLocal: boolean) => void; // Function to handle delete action
    title: string; // Title for the modal header
    content: string; // Content to display in the modal body
}

const DeleteDialog: React.FC<DeleteDialogProps> = ({ isOpen, onClose, onDelete, title, content }) => {
    const [deleteLocal, setDeleteLocal] = React.useState<boolean>(true);
    const { user } = useSidebar();
    return (
        <Modal
            isOpen={isOpen}
            placement="top-center"
            onClose={onClose}
        >
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className="flex flex-col">{title}</ModalHeader>
                        <ModalBody>
                            <p className='text-sm'>{content}</p>
                            <div className="flex py-2 px-1 justify-between">
                                {/* <Checkbox
                                    color="default"
                                    isSelected={deleteLocal}
                                    onChange={() => setDeleteLocal(!deleteLocal)}
                                    classNames={{
                                        label: "text-small",
                                    }}
                                >
                                </Checkbox> */}
                                {!user && (<p className='text-sm text-gray-600'>
                                    Note that this log will still be available at its unique link until it expires.
                                </p>
                                )}
                            </div>
                        </ModalBody>
                        <ModalFooter>
                            <Button color="default" variant="flat" onPress={onClose}>
                                Cancel
                            </Button>
                            <Button
                                color="danger" onPress={() => { onDelete(deleteLocal); onClose(); }}>
                                Delete
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
};

export default DeleteDialog;
