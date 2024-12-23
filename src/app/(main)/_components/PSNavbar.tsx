import { useNavbar } from '@/lib/Context/PSNavbarProvider';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { usePathname, useRouter } from "next/navigation";
import { FiSidebar } from 'react-icons/fi';
import { useSidebar } from "../_hooks/useSidebar";
import IconButton from './IconButton';
import { ThemeSwitcher } from "./ThemeSwitcher";
interface PSNavbarProps {
    className?: string;
    sideBarIcon?: boolean;
    onToggleSidebar?: () => void;
}
const PSNavbar: React.FC<PSNavbarProps> = ({ sideBarIcon, className }) => {
    const router = useRouter();
    const { showSideBar, setShowSideBar, setId, setSelected } = useSidebar();
    const pathName = usePathname();
    const isPublishRoute = pathName.includes('/logs/publish');
    const { navbarTitle } = useNavbar();
    return (
        <div className={`bg-background px-16 sticky top-0 z-50 w-full h-16 flex justify-between items-center ${className}`}>
            <div className='flex space-x-20'>
                <div className='flex'>
                    {
                        sideBarIcon && (
                            <IconButton
                                className='absolute top-2 left-2'
                                onClick={() => {
                                    setShowSideBar(!showSideBar)
                                }}
                                ariaLabel="Open Sidebar">
                                <FiSidebar className='text-2xl' />
                            </IconButton>
                        )}
                    <div className={`py-6 mt-2 h-11 w-11 flex items-center cursor-pointer hover:animate-spin`}
                        onClick={() => {
                            setId(null)
                            setSelected(null)
                            router.push('/logs');
                        }}>
                        <Image
                            src={"/images/frame.png"}
                            alt="Logo"
                            layout="responsive"
                            width={6}
                            height={6}
                            className="hover:animate-spin transition-transform duration-500 transform hover:scale-105 hidden md:block"
                        />
                    </div>
                </div>
                {/* appbar content */}
                <div className='flex grow items-center'>
                    <motion.p
                        className='md:text-lg sm:text-sm sm:text-center'
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