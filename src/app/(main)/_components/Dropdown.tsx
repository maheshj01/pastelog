import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from '@nextui-org/react';
import { Key, ReactNode } from 'react';

interface PSDropdownProps {
    options: string[];
    onClick: (key: Key) => void;
    children: ReactNode;
    className?: string;
    placement?: 'top' | 'bottom' | 'left' | 'right' | 'top-start' | 'top-end' | 'bottom-start' | 'bottom-end' | 'left-start' | 'left-end' | 'right-start' | 'right-end';
}

const PSDropdown: React.FC<PSDropdownProps> = ({ options, onClick, children, className, placement }) => {
    return (
        <Dropdown
            size='md'
            className={`min-w-32 w-fit ${className}`}
            placement={placement}
        >
            <DropdownTrigger>
                {children}
            </DropdownTrigger>
            <DropdownMenu
                aria-label="menu"
                onAction={onClick}
            >
                {options.map((option, index) => (
                    <DropdownItem key={option}>{option}</DropdownItem>
                ))}
            </DropdownMenu>
        </Dropdown>
    );
};

export default PSDropdown;
