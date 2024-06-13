import ViewSidebarRoundedIcon from '@mui/icons-material/ViewSidebarRounded';
import {
    Navbar,
    NavbarContent,
    NavbarMenu,
    NavbarMenuItem
} from "@nextui-org/navbar";
import { useRouter } from "next/navigation";
import { useSidebar } from '../_services/Context';
import IconButton from './IconButton';
import { ThemeSwitcher } from "./ThemeSwitcher";

interface PSNavbarProps {
    className?: string;
    sideBarIcon?: boolean;
    onToggleSidebar?: () => void;
}

const PSNavbar: React.FC<PSNavbarProps> = ({ sideBarIcon }) => {
    const router = useRouter();
    const { showSideBar, setShowSideBar } = useSidebar();

    return (
        <Navbar
            position='sticky'
            className="bg-background dark:bg-gray-600" maxWidth="full">
            <NavbarContent
                className="px-2 ml-0">
                <div className='flex space-x-8'>
                    {
                        sideBarIcon && (
                            <IconButton
                                className='absolute top-2 left-2'
                                onClick={() => {
                                    setShowSideBar(!showSideBar)
                                }}
                                ariaLabel="Open Sidebar"
                            >
                                <ViewSidebarRoundedIcon />
                            </IconButton>
                        )}
                    <p
                        onClick={() => {
                            router.push('/logs');
                        }}
                        className="font-bold text-inherit text-lg px-2 cursor-pointer">Pastelog</p>
                </div>
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
export default PSNavbar;