import { createContext, ReactNode, useContext, useState } from "react";

interface NavbarContextProps {
    navbarTitle: string | null;
    setNavbarTitle: (title: string | null) => void;
}

const NavbarContext = createContext<NavbarContextProps | undefined>(undefined);

export const PSNavbarProvider = ({ children }: { children: ReactNode }) => {
    const [navbarTitle, setNavbarTitle] = useState<string | null>(null);

    return (
        <NavbarContext.Provider value={{ navbarTitle, setNavbarTitle }}>
            {children}
        </NavbarContext.Provider>
    );
};

export const useNavbar = () => {
    const context = useContext(NavbarContext);
    if (!context) {
        throw new Error("useNavbar must be used within a NavbarProvider");
    }
    return context;
};
