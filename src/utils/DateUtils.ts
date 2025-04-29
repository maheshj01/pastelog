import { CalendarDate } from "@nextui-org/react";
import { parseDate } from "@internationalized/date";
import { Timestamp } from "firebase/firestore";

class DateUtils {
    static toUTC(date: Date): string {
        return date.toISOString();
    }

    static toLocal(dateString: string): Date {
        return new Date(dateString);
    }

    static formatForDisplay(date: Date): string {
        return date.toLocaleString(); // Customize options as needed
    }

    // date in dd/mm/yyyy format
    static formatDateDDMMYYYY(date: Date): string {
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    }

    // date in April 24, 2023 format
    static formatDateMMMMDDYYYY(date: Date): string {
        const options: Intl.DateTimeFormatOptions = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        };
        return date.toLocaleDateString('en-US', options);
    }

    static getDateOffsetBy = (days: number): string => {
        const date = new Date();
        date.setDate(date.getDate() + days);
        return DateUtils.formatDateISO(date);
    };

    // returns date in ISO format
    static formatDateISO = (date: Date): string => {
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const year = date.getFullYear();
        return `${year}-${month}-${day}`;
    };

    static parsedDate = (date: Date): CalendarDate => {
        const isoDate = DateUtils.formatDateISO(date);
        const parsedDate = parseDate(isoDate);
        return parsedDate;
    }

    static timestampToISOString(input: Timestamp | string): string {
        if (typeof input === "string") return input;
        if (input instanceof Timestamp) return input.toDate().toISOString();
        return "";
    }

    static formatReadableDate = (dateInput: string | Timestamp | null | undefined): string => {
        if (!dateInput) return '';

        let date: Date;

        if (typeof dateInput === "string") {
            date = new Date(dateInput); // ISO string
        } else if (dateInput instanceof Timestamp) {
            date = dateInput.toDate(); // Firestore Timestamp
        } else {
            return '';
        }

        const options: Intl.DateTimeFormatOptions = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            hour12: true, // Optional: 12-hour format
        };

        return date.toLocaleString('en-local', options);
    };
}

export default DateUtils;
