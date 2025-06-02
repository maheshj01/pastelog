import { showToast } from '@/utils/toast_utils';
import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from '@nextui-org/react';
import Image from 'next/image';
import React from 'react';
import { toast } from 'react-toastify';
import Analytics from '../../_services/Analytics';
import GradientText from '../GradientText';
import PSInput from '../PSInput';
import { Button } from '../button';
interface GeminiDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (api: string) => void;
    title: string;
    content: string;
}

const GeminiDialog: React.FC<GeminiDialogProps> = ({ isOpen, onClose, onSave, title, content }) => {
    const toastId = React.useRef('stored-toast');

    const [value, setValue] = React.useState<string>('');
    const notify = (message: string) => {
        if (!toast.isActive(toastId.current!)) {
            showToast('success', <p> {message} </p >,
                {
                    toastId: 'stored-toast',
                }
            );
        }
        Analytics.logEvent('API key Stored');
    }

    return (
        <Modal size="md" isOpen={isOpen} onClose={onClose} isDismissable={true}>
            <ModalContent className="gemini-dialog-class">
                <ModalHeader className="flex flex-col mt-1">
                    <div className="flex">
                        <Image
                            src={'/images/gemini.png'}
                            alt="Logo"
                            width={32}
                            height={32}
                            className="cursor-pointer transition-transform duration-500 transform hover:scale-150"
                        />
                        <GradientText text={title} gradientColors={['#FF0080', '#7928CA']} fontSize="2rem" />
                    </div>
                    <p className="text-sm mt-2 font-normal">{content}</p>
                </ModalHeader>
                <ModalBody>
                    <div className="flex flex-col">
                        <PSInput
                            value={value}
                            onChange={(e) => setValue(e.target.value)}
                            placeHolder="Enter Your API key"
                            className="mt-1 w-full" />
                        <p className='text-sm mt-2 mb-4 text-gray-400'> Note: The API key is stored in memory only for the time this app runs.</p>
                        <p className="text-md">How to get the API key?</p>
                        <p className="text-sm text-gray-400">1. Go to <a href="https://ai.google.dev/gemini-api" target="_blank" className="text-blue-500">ai.google.dev/gemini-api</a> and login.</p>
                        <p className="text-sm text-gray-400">{'2. Click -> Get API key in Google AI Studio'}</p>
                        <p className="text-sm text-gray-400">3. Create API key</p>
                    </div>
                </ModalBody>
                <ModalFooter>
                    <Button
                        variant="destructive"
                        onClick={onClose}>
                        Close
                    </Button>
                    <Button
                        onClick={() => {
                            if (value) {
                                notify('API Key Stored in Ephemeral Storage');
                                onSave(value);
                                onClose();
                            }
                        }}
                        className={'bg-gradient-to-r from-gray-700 to-gray-800'}>
                        <p className='mx-2'>Store API key</p>
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal >
    );
};

export default GeminiDialog;
