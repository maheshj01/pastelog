import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@nextui-org/react";
import { UploadIcon } from "@radix-ui/react-icons";
import React, { useEffect, useState } from "react";
import PSInput from "../PSInput";
import { Button } from "../button";
interface ImportDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onImport: (url: string) => void;
    title: string;
    content: string;
    importLoading: boolean;
}

const ImportDialog: React.FC<ImportDialogProps> = ({ isOpen, onClose, onImport, title, content, importLoading }) => {
    const [url, setUrl] = useState<string>('');
    useEffect(() => {
        setUrl('');
    }, []);
    return (
        <Modal size="md" isOpen={isOpen} onClose={onClose} isDismissable={true}>
            <ModalContent>
                <ModalHeader className="flex flex-col gap-1">{title}</ModalHeader>
                <ModalBody>
                    <p className='text-sm text-gray-400'>{content}</p>
                    <PSInput
                        value={url}
                        className="w-full"
                        onChange={(e) => setUrl(e.target.value)}
                        placeHolder="Enter the URL of the log to import"
                    />
                </ModalBody>
                <ModalFooter>
                    <Button
                        variant="destructive"
                        onClick={onClose}>
                        Close
                    </Button>
                    <Button
                        onClick={() => {
                            onImport(url);
                        }}
                        className={`bg-gradient-to-r from-gray-700 to-gray-800`}>
                        <p className='mx-2'>
                            {importLoading ? (
                                <div className="loader mx-6" />
                            ) : "Import"}
                        </p> <UploadIcon />
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal >
    );
};

export default ImportDialog;
