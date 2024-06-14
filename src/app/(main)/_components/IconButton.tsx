import { Button } from '@nextui-org/button';
import { Tooltip } from "@nextui-org/tooltip";
type IconButtonProps = {
  onClick?: () => void;
  children: React.ReactNode;
  ariaLabel?: string;
  className?: string;
  tooltipPlacement?: "top-start" | "top" | "top-end" | "right-start" | "right" | "right-end" | "bottom-start" | "bottom" | "bottom-end" | "left-start" | "left" | "left-end";
};

const IconButton: React.FC<IconButtonProps> = ({ onClick, children, ariaLabel, className, tooltipPlacement }) => {
  return (
    <Tooltip
      content={ariaLabel}
      placement={tooltipPlacement}
      showArrow={true}
    >
      <Button
        isIconOnly
        aria-label={ariaLabel}
        className={`bg-transparent rounded-full p-2 dark:text-white ${className}`}
        onClick={onClick}
        size='lg'
      >
        {children}
      </Button>
    </Tooltip>
  );
};

export default IconButton;