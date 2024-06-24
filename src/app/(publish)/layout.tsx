import { Metadata } from "next";
import PSNavbar from "../(main)/_components/PSNavbar";

export const metadata: Metadata = {
    title: "Pastelog",
    description: "Create Stunning Rich Text Logs/Notes with markdown Support and Code Highlighting and share it with the world.",

};
export default function PublishLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex flex-col">
            <PSNavbar />
            {children}
        </div>
    );
}