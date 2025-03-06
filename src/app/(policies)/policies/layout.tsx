"use client";

import { PSNavbarProvider } from "@/lib/Context/PSNavbarProvider";
import { store } from "@/lib/store";
import { Provider } from "react-redux";
import PSNavbar from "../../(main)/_components/PSNavbar";

export default function PolicyLayout({ children }: { children: React.ReactNode }) {
    return (
        <Provider store={store}>
            <PSNavbarProvider>
                <div className="flex flex-col">
                    <PSNavbar />
                    {children}
                </div>
            </PSNavbarProvider>
        </Provider>
    );
}