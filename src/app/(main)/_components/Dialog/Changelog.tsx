import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@nextui-org/react";
import { EyeOpenIcon } from "@radix-ui/react-icons";
import React from "react";
import { Button } from "../button";
import MDPreview from "../MDPreview";
interface ChangelogDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onShare: () => void; // Function to handle share action
    title: string; // Title for the modal header
    content: string; // Content to display in the modal body
}

const ChangelogDialog: React.FC<ChangelogDialogProps> = ({ isOpen, onClose, onShare, title, content }) => {
    return (
        <Modal size="md" isOpen={isOpen} onClose={onClose} isDismissable={true}>
            <ModalContent>
                <ModalHeader className="flex flex-col gap-1">{title}</ModalHeader>
                <ModalBody>
                    <MDPreview
                        value={content} />
                </ModalBody>
                <ModalFooter>
                    <Button
                        variant="destructive"
                        onClick={onClose}>
                        Close
                    </Button>
                    <Button
                        onClick={onShare}
                        className={`bg-gradient-to-r from-gray-700 to-gray-800`}>
                        <p className='mx-2'>Preview</p> <EyeOpenIcon />
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal >
    );
};

export default ChangelogDialog;
