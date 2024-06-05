import { useTheme } from "next-themes";
import PSNavbar from "./PSNavbar";
export default function Pastelog() {
    const { theme, setTheme } = useTheme()
    return (
        <>
            <PSNavbar />
            <div className="flex flex-col space-y-4 min-h-screen">
                <div className="min-h-screen flex justify-center items-center">
                    {theme === 'dark' ? <h1 className="text-white">Dark Mode</h1> : <h1 className="text-black">Light Mode</h1>}
                </div>
            </div>
        </>
    );
}   