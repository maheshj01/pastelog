import { useNavbar } from '@/lib/Context/PSNavbarProvider';
import { setId, setSelected, setShowSideBar } from '@/lib/features/menus/sidebarSlice';
import { AppDispatch, RootState } from '@/lib/store';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { usePathname, useRouter } from "next/navigation";
import { FiSidebar } from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import IconButton from './IconButton';
import { ThemeSwitcher } from "./ThemeSwitcher";

interface PSNavbarProps {
    className?: string;
    sideBarIcon?: boolean;
    onToggleSidebar?: () => void;
}
const PSNavbar: React.FC<PSNavbarProps> = ({ sideBarIcon, className }) => {
    const router = useRouter();
    const pathName = usePathname();
    const isPublishRoute = pathName.includes('/logs/publish');
    const { navbarTitle } = useNavbar();
    const showSideBar = useSelector((state: RootState) => state.sidebar.showSideBar);
    const dispatch = useDispatch<AppDispatch>();
    return (
        <div className={`bg-background px-16 sticky top-0 z-50 w-full h-16 flex justify-between items-center ${className}`}>
            <div className='flex space-x-20'>
                <div className='flex'>
                    {
                        sideBarIcon && (
                            <IconButton
                                className='absolute top-2 left-2'
                                onClick={() => {
                                    dispatch(setShowSideBar(!showSideBar));
                                }}
                                ariaLabel="Open Sidebar">
                                <FiSidebar className='text-2xl' />
                            </IconButton>
                        )}
                    <div className={`py-6 mt-2 h-11 w-11 flex items-center cursor-pointer`}
                        onClick={() => {
                            dispatch(setId(null))
                            dispatch(setSelected(null));
                            router.push('/logs');
                        }}>
                        <Image
                            src={"/images/frame.png"}
                            alt="Logo"
                            width={50}
                            height={50}
                            className="transition-transform duration-500 transform hover:scale-105 hidden md:block"
                        />
                    </div>
                </div>
                {/* appbar content */}
                <div className='flex grow items-center overflow-hidden'>
                    <motion.p
                        className='truncate text-base md:text-lg lg:text-xl font-medium whitespace-nowrap overflow-hidden text-ellipsis w-full'
                        initial={{ translateY: 16 }}
                        animate={{ translateY: 0 }}
                        transition={{ duration: 0.3 }}
                        key={navbarTitle}
                    >
                        {navbarTitle}
                    </motion.p>
                </div>
            </div>
            <div className="px-10">
                {isPublishRoute && <ThemeSwitcher />}
            </div>
        </div>
    )
}
export default PSNavbar;