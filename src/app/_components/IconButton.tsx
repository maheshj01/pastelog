import { Button } from '@nextui-org/button';

type IconButtonProps = {
  onClick?: () => void;
  children: React.ReactNode;
  ariaLabel: string;
  className?: string;
};

const IconButton: React.FC<IconButtonProps> = ({ onClick, children, ariaLabel, className }) => {
  return (
    <Button
      isIconOnly
      aria-label={ariaLabel}
      className={`bg-transparent rounded-full p-2 dark:text-white ${className}`}
      onClick={onClick}
      size='lg'
    >
      {children}
    </Button>
  );
};

export default IconButton;