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
}

export default DateUtils;
