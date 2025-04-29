import { CalendarDate } from "@nextui-org/react";
import { Timestamp } from "firebase/firestore";
import html2canvas from "html2canvas";

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

export const isExpired = (expiryDate: Timestamp | string | null | undefined): boolean => {
    if (!expiryDate) return false;

    let expiry: Date;
    if (expiryDate instanceof Timestamp) {
        expiry = expiryDate.toDate();
    } else if (typeof expiryDate === "string") {
        expiry = new Date(expiryDate);
    } else {
        return false;
    }

    const now = new Date();
    return expiry.getTime() <= now.getTime();
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