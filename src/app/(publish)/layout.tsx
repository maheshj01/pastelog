"use client";

import { PSNavbarProvider } from "@/lib/Context/PSNavbarProvider";
import { store } from "@/lib/store";
import { Provider } from "react-redux";
import PSNavbar from "../(main)/_components/PSNavbar";

export default function PublishLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex flex-col">
            <Provider store={store}>
                <PSNavbarProvider>
                    <PSNavbar />
                    {children}
                </PSNavbarProvider>
            </Provider>
        </div>
    );
}