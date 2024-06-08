import {
    Navbar,
    NavbarContent,
    NavbarMenu,
    NavbarMenuItem
} from "@nextui-org/navbar";
import { useRouter } from "next/navigation";
import { ThemeSwitcher } from "./ThemeSwitcher";

export default function PSNavbar() {
    const router = useRouter();
    return (
        <Navbar className="shadow-sm dark:bg-gray-800" maxWidth="full">
            <NavbarContent
                className="px-2 ml-0">
                <p
                    onClick={() => {
                        router.push('/');
                    }}
                    className="font-bold text-inherit text-lg px-2 cursor-pointer">Pastelog</p>
            </NavbarContent>
            <NavbarContent>
                <NavbarMenu>
                    <NavbarMenuItem>Home</NavbarMenuItem>
                    <NavbarMenuItem>About</NavbarMenuItem>
                    <NavbarMenuItem>Contact</NavbarMenuItem>
                </NavbarMenu>
            </NavbarContent>

            <NavbarContent justify="end">
                <ThemeSwitcher />
            </NavbarContent>
        </Navbar>
    )
}