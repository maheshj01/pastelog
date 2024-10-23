import { cn } from "@nextui-org/react";
import { CalendarIcon } from "@radix-ui/react-icons";
import { format } from "date-fns";
import React from "react";
import { useSidebar } from "../_hooks/useSidebar";
import { Button } from "./button";
import { Calendar } from "./calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";

export function DatePicker({ selected, onSelect, label }: { selected?: Date; onSelect: any, label?: string }) {
    const [isPopoverOpen, setIsPopoverOpen] = React.useState(false);
    const today = new Date();
    // const isSmall = useSmallScreen();
    const { user } = useSidebar();
    return (
        <Popover
            open={isPopoverOpen}
            onOpenChange={setIsPopoverOpen}
        >
            <PopoverTrigger asChild>
                <div className='flex flex-col'>
                    <Button
                        variant="outline"
                        className={cn('px-2 justify-start text-left font-normal', !selected && 'text-muted-foreground')}
                    >
                        <CalendarIcon className="mr-2 h-4 w-4 dark:text-white" />
                        {selected ? <span className="dark:text-white">{format(selected, 'PP')} </span> : <span className="dark:text-white">Pick a date</span>}
                    </Button>
                    {(label && <p className="px-2 cursor-pointer">{label}</p>)}
                </div>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 bg-background">
                <Calendar
                    mode="single"
                    fromDate={today}
                    selected={selected}
                    defaultMonth={selected}
                    toYear={user ? today.getFullYear() + 10 : today.getFullYear() + 1}
                    toDate={new Date(today.getFullYear() + 10, today.getMonth() + 1, 0)}
                    onSelect={(e) => {
                        if (onSelect) {
                            onSelect(e);
                        }
                        setIsPopoverOpen(false);
                    }}
                    initialFocus
                />
            </PopoverContent>
        </Popover>
    );
}
