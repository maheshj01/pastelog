import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@nextui-org/react";
import React from "react";
import { Button } from "./button";

interface ShareDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onShare: () => void; // Function to handle share action
    title: string; // Title for the modal header
    content: string; // Content to display in the modal body
}

const ShareDialog: React.FC<ShareDialogProps> = ({ isOpen, onClose, onShare, title, content }) => {
    return (
        <Modal size="md" isOpen={isOpen} onClose={onClose} isDismissable={true}>
            <ModalContent>
                <ModalHeader className="flex flex-col gap-1">{title}</ModalHeader>
                <ModalBody>
                    <div className="h-8 border-1 w-full rounded-md flex items-center px-2 overflow-hidden text-ellipsis ">
                        {content}
                    </div>
                </ModalBody>
                <ModalFooter>
                    <Button
                        variant={"destructive"}
                        onClick={onClose}>
                        Close
                    </Button>
                    <Button
                        onClick={onShare}
                        className={`bg-gradient-to-r from-gray-700 to-gray-800`}>
                        Copy
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal >
    );
};

export default ShareDialog;
