import { showToast } from "@/utils/toast_utils";
import React, { useState } from "react";
import { toast } from "react-toastify";
import IconButton from './IconButton';

interface CopyIconProps {
    className?: string
    icon?: React.ReactNode
    copiedIcon?: React.ReactNode
    onClick?: () => void
    tooltip?: string
    message: string
    data: string
    id: string
}
export default function CopyIcon({ id, className, icon, message, copiedIcon, onClick, data, tooltip }: CopyIconProps) {
    const [copied, setCopied] = useState<boolean>(false);


    function handleIconClick() {
        onClick && onClick();
        navigator.clipboard.writeText(data)
            .then(() => {
                setCopied(true);
                notify(message);
            })
            .catch(() => {
                notify("Failed to copy!");
            });
        setTimeout(() => {
            setCopied(false);
        }, 2000);
    }


    const toastId = React.useRef(id);

    const notify = (message: string) => {
        if (!toast.isActive(toastId.current)) {
            showToast(
                "success",
                <p>{message}</p>,
                {
                    toastId: toastId.current,
                    autoClose: 1000
                },
            );
        }
    };

    return (
        <IconButton
            ariaLabel={tooltip}
            onClick={handleIconClick} className={className}>
            {!copied ? icon : copiedIcon}
        </IconButton>
    )

}