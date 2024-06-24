import { Metadata } from 'next';
import Pastelog from "../_components/Pastelog";

export const metadata: Metadata = {
    title: "Pastelog",
    description: "Create Stunning Rich Text Logs/Notes with markdown Support and Code Highlighting and share it with the world.",

};
export default function LogsPage() {
    return (
        <div className={`grow`}>
            {/* Main content */}
            <div className="flex flex-col h-full">
                <Pastelog />
            </div>
        </div>
    );
}