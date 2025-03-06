"use client";

import { PSNavbarProvider } from "@/lib/Context/PSNavbarProvider";
import PSNavbar from "../(main)/_components/PSNavbar";
import { Provider } from "react-redux";
import { store } from "@/lib/store";

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