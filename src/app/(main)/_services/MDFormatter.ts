export class MarkdownFormatter {
    private value: string;

    constructor(initialValue: string = '') {
        this.value = initialValue;
    }

    public getValue(): string {
        return this.value;
    }

    public setValue(newValue: string): void {
        this.value = newValue;
    }

    public applyFormatting(start: number, end: number, syntax: string): { value: string, newCursorPos: number } {
        let selectedText = this.value.substring(start, end);

        const trimmedText = selectedText.trim();

        if (trimmedText === '') {
            return { value: this.value, newCursorPos: end };
        }

        const trimStart = selectedText.indexOf(trimmedText);
        const trimEnd = trimStart + trimmedText.length;

        const formattedText =
            selectedText.substring(0, trimStart) +
            `${syntax}${trimmedText}${syntax}` +
            selectedText.substring(trimEnd);

        const newValue =
            this.value.substring(0, start) +
            formattedText +
            this.value.substring(end);

        const newCursorPos = start + formattedText.length;

        return { value: newValue, newCursorPos };
    }

    public applyLinkFormatting(start: number, end: number, url?: string): { value: string, newCursorPos: number } {
        const selectedText = this.value.substring(start, end);
        if (url) {
            const newValue =
                this.value.substring(0, start) +
                `[${selectedText}](${url})` +
                this.value.substring(end);
            return { value: newValue, newCursorPos: end + 3 };
        } else {
            const newValue =
                this.value.substring(0, start) +
                `[${selectedText}]()` +
                this.value.substring(end);
            return { value: newValue, newCursorPos: end + 3 };
        }

    }

    public applyListFormatting(start: number, listSyntax: string): { value: string, newCursorPos: number } {
        const lineStart = this.value.lastIndexOf('\n', start - 1) + 1;
        const newValue =
            this.value.substring(0, lineStart) +
            listSyntax +
            this.value.substring(lineStart);

        return { value: newValue, newCursorPos: start + listSyntax.length };
    }

    public applyCodeBlockFormatting(start: number, end: number): { value: string, newCursorPos: number } {
        const selectedText = this.value.substring(start, end);
        const newValue =
            this.value.substring(0, start) +
            `\n\`\`\`\n${selectedText}\n\`\`\`\n` +
            this.value.substring(end);

        return { value: newValue, newCursorPos: end + 8 };
    }

    public applyBlockquoteFormatting(start: number): { value: string, newCursorPos: number } {
        const lineStart = this.value.lastIndexOf('\n', start - 1) + 1;
        const newValue =
            this.value.substring(0, lineStart) +
            '> ' +
            this.value.substring(lineStart);

        return { value: newValue, newCursorPos: start + 2 };
    }

    public applyHeadingFormatting(start: number, level: number): { value: string, newCursorPos: number } {
        const lineStart = this.value.lastIndexOf('\n', start - 1) + 1;
        const headingSyntax = '#'.repeat(level) + ' ';
        const newValue =
            this.value.substring(0, lineStart) +
            headingSyntax +
            this.value.substring(lineStart);

        return { value: newValue, newCursorPos: start + headingSyntax.length };
    }

    public insertHorizontalRule(start: number): { value: string, newCursorPos: number } {
        const newValue =
            this.value.substring(0, start) +
            '\n---\n' +
            this.value.substring(start);

        return { value: newValue, newCursorPos: start + 5 };
    }
}