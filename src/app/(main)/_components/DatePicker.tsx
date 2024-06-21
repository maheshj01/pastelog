import { cn } from "@nextui-org/react";
import { CalendarIcon } from "@radix-ui/react-icons";
import { format } from "date-fns";
import React from "react";
import { Button } from "./button";
import { Calendar } from "./calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";

export function DatePicker({ selected, onSelect }: { selected?: Date; onSelect: any }) {
    const [isPopoverOpen, setIsPopoverOpen] = React.useState(false);
    const today = new Date();
    return (
        <Popover
            open={isPopoverOpen}
            onOpenChange={setIsPopoverOpen}

        >
            <PopoverTrigger asChild>
                <div className='flex flex-col'>
                    <Button
                        variant="outline"
                        className={cn('w-[200px] justify-start text-left font-normal', !selected && 'text-muted-foreground')}
                    >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {selected ? format(selected, 'PPP') : <span>Pick a date</span>}
                    </Button>
                    <p className="px-2 cursor-pointer">Select Expiry Date</p>
                </div>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 bg-background">
                <Calendar
                    mode="single"
                    fromDate={today}
                    selected={selected}
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
