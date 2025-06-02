export class Constants {
    static readonly publicLogIds = ['getting-started', 'shortcuts'];
    static readonly styles = {
        iconTheme: 'size-6 text-black dark:text-white',
        smallIconTheme: 'size-4 text-black dark:text-white'
    };

    static readonly description = 'PasteLog is a simple, fast, and powerful pastebin. It is powered by firebase in the backend. It allows you to publish your logs, and access them from anywhere and any device via a unique link.'
}

export enum LogType {
    TEXT = 'text',
    CODE = 'code',
}