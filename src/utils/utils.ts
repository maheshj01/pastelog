import { parseDate } from "@internationalized/date";
import { CalendarDate } from "@nextui-org/react";

export const getDateOffsetBy = (days: number): Date => {
    const date = new Date();
    date.setDate(date.getDate() + days);
    return date;
};

// returns date in ISO format
const formatDateISO = (date: Date): string => {
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const year = date.getFullYear();
    return `${year}-${month}-${day}`;
};

export const parsedDate = (date: Date): CalendarDate => {
    const isoDate = formatDateISO(date);
    const parsedDate = parseDate(isoDate);
    return parsedDate;
}

export const formatReadableDate = (date: Date): string => {
    const options: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    };
    return date.toLocaleDateString(undefined, options);
}