import { showToast } from "@/utils/toast_utils";
import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@nextui-org/react";
import { ClipboardCopyIcon, EyeOpenIcon } from "@radix-ui/react-icons";
import React from "react";
import { toast } from "react-toastify";
import IconButton from "../IconButton";
import { Button } from "../button";
interface ShareDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onShare: () => void; // Function to handle share action
    title: string; // Title for the modal header
    content: string; // Content to display in the modal body
}

const ShareDialog: React.FC<ShareDialogProps> = ({ isOpen, onClose, onShare, title, content }) => {
    const toastId = React.useRef('copied-toast');
    const notify = () => {
        if (!toast.isActive(toastId.current!)) {
            showToast("success", <p> Link copied! </p >,
                {
                    toastId: 'copied-toast',
                    style: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        color: 'white',
                    }
                }
            );
        }
    }
    return (
        <Modal
            onClick={
                (e) => {
                    e.stopPropagation();
                }
            }
            size="md" isOpen={isOpen} onClose={onClose} isDismissable={true}>
            <ModalContent>
                <ModalHeader className="flex flex-col gap-1">{title}</ModalHeader>
                <ModalBody>
                    <div className="flex items-center">
                        <div className="grow h-8 border-1 w-full rounded-md flex items-center px-2 overflow-hidden whitespace-nowrap text-ellipsis">
                            <span className="block w-full overflow-hidden text-ellipsis">
                                {content}
                            </span>
                        </div>
                        <div>
                            <IconButton ariaLabel="Copy" onClick={() => {
                                navigator.clipboard.writeText(content);
                                notify();
                            }}>
                                <ClipboardCopyIcon className="size-6 text-black dark:text-white" />
                            </IconButton>
                        </div>
                    </div>
                    <p className='text-sm mt-6 text-gray-400'> Note: This log will be available to anyone with the link.</p>
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

export default ShareDialog;
