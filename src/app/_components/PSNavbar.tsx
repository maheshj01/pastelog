import {
    Navbar,
    NavbarContent,
    NavbarMenu,
    NavbarMenuItem
} from "@nextui-org/navbar";
import { ThemeSwitcher } from "./ThemeSwitcher";

export default function PSNavbar() {
    return (
        <Navbar className="bg-primary-50 shadow-sm dark:bg-gray-800" maxWidth="full">
            <NavbarContent className="px-2 ml-0">
                <p className="font-bold text-inherit text-lg">Pastelog</p>
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