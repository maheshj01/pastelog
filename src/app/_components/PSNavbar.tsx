import {
    Navbar,
    NavbarBrand,
    NavbarContent,
    NavbarMenu,
    NavbarMenuItem
} from "@nextui-org/navbar";
import { ThemeSwitcher } from "./ThemeSwitcher";

export default function PSNavbar() {
    return (
        <Navbar>
            <NavbarBrand>
                <p className="font-bold text-inherit">Pastelog</p>
            </NavbarBrand>
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