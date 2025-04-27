import { parseDate } from "@internationalized/date";
import { CalendarDate } from "@nextui-org/react";
import { Timestamp } from "firebase/firestore";
import html2canvas from "html2canvas";

export const getDateOffsetBy = (days: number): string => {
    const date = new Date();
    date.setDate(date.getDate() + days);
    return formatDateISO(date);
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


export function timestampToISOString(input: Timestamp | string): string {
    if (typeof input === "string") return input;
    if (input instanceof Timestamp) return input.toDate().toISOString();
    return "";
}

export const formatReadableDate = (dateInput: string | Timestamp | null | undefined): string => {
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

export const downloadImage = async () => {
    const preview = document.getElementById('preview');
    if (!preview) return;

    const codeBlocks = preview.querySelectorAll('code:not(pre code)');

    // Add custom class to fix rendering issues
    codeBlocks.forEach(block => {
        const codeBlock = block as HTMLElement;  // Cast to HTMLElement
        codeBlock.style.paddingBottom = '1.0em';
        // codeBlock.style.backgroundColor = 'red';
        // codeBlock.style.display = 'inline-block';
        // codeBlock.style.verticalAlign = 'middle';
    });

    const previewElement = preview.querySelector('.reactMarkDown');
    const originalClasses = previewElement!.className;

    previewElement!.className = originalClasses.replace(/fade-in-animation|fade-out-animation/g, '').trim();

    // Ensure all images within the preview element are fully loaded
    const images = Array.from(preview.getElementsByTagName('img'));
    await Promise.all(images.map(img => new Promise<void>((resolve, reject) => {
        if (img.complete) {
            resolve();
        } else {
            img.onload = () => resolve();
            img.onerror = () => reject();
        }
        if (!img.crossOrigin) {
            img.crossOrigin = 'anonymous';
        }
    })));

    // Capture the canvas and download the image
    html2canvas(preview, { useCORS: true }).then((canvas) => {
        const link = document.createElement('a');
        link.download = 'pastelog.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
        // Restore the original styles after capturing the canvas
        codeBlocks.forEach(block => {
            const codeBlock = block as HTMLElement;  // Cast to HTMLElement
            codeBlock.style.paddingBottom = '';
        });
        previewElement!.className = originalClasses;
    }).catch(error => {
        previewElement!.className = originalClasses;
        console.error(error);
    });
};

export const downloadText = (previewLog: any) => {
    if (!previewLog?.data) return;
    const element = document.createElement("a");
    const file = new Blob([previewLog.data], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = "pastelog.txt";
    document.body.appendChild(element); // Required for this to work in FireFox
    element.click();
}