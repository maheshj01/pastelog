// src/_services/EditorState.ts
export class EditorHistoryState {
    private history: string[];
    private historyIndex: number;

    constructor(initialValue: string) {
        this.history = [initialValue];
        this.historyIndex = 0;
    }

    getCurrentValue(): string {
        return this.history[this.historyIndex];
    }

    updateValue(newValue: string) {
        if (newValue !== this.getCurrentValue()) {
            this.history = this.history.slice(0, this.historyIndex + 1);
            this.history.push(newValue);
            this.historyIndex = this.history.length - 1;
        }
    }

    undo(): string | null {
        if (this.historyIndex > 0) {
            this.historyIndex--;
            return this.getCurrentValue();
        }
        return null;
    }

    redo(): string | null {
        if (this.historyIndex < this.history.length - 1) {
            this.historyIndex++;
            return this.getCurrentValue();
        }
        return null;
    }

    // New method to update the current value without adding to history
    setCurrentValue(newValue: string) {
        if (this.getCurrentValue() !== newValue) {
            this.history[this.historyIndex] = newValue;
        }
    }
}