import { Constants } from '@/app/constants';
import { RootState } from '@/lib/store';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@radix-ui/react-hover-card';
import { ExitIcon } from '@radix-ui/react-icons';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import * as React from 'react';
import { FaBug, FaGithub, FaGoogle, FaNewspaper, FaWpexplorer } from "react-icons/fa";
import { useSelector } from 'react-redux';
import useSettings from '../_hooks/useSettings';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from './dropdown-menu';

interface LoginMenuProps {
    onLogOut: () => void;
    onLogin: () => void;
    onSettings: () => void;
    loading: boolean;
}

const LoginMenu: React.FC<LoginMenuProps> = ({ onLogOut, onLogin, loading, onSettings }) => {

    const user = useSelector((state: RootState) => state.auth.user);
    const { settings, toggleNewUser, setNewUser } = useSettings();
    const { menuItems, loading: loadingMenu } = useSelector((state: RootState) => state.menu);
    const router = useRouter();
    return (
        <div className='sticky bottom-0'>
            {user ? (
                <DropdownMenu >
                    <DropdownMenuTrigger asChild>
                        <div className='cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-800 p-2 rounded-full relative hover:scale-110 transition-all duration-300'>
                            <Image
                                src={user.photoURL!}
                                alt="User profile"
                                width={36}
                                height={36}
                                className="rounded-full"
                            />
                        </div>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="p-1 bg-white dark:bg-gray-800 rounded-lg shadow-lg transition-all duration-300">
                        <DropdownMenuLabel>My Account</DropdownMenuLabel>
                        <div className="flex items-center space-x-2 p-2">
                            <Image
                                src={user.photoURL!}
                                alt="User profile"
                                width={32}
                                height={32}
                                className="rounded-full"
                            />
                            <div className="flex flex-col">
                                <div className="text-sm text-black dark:text-white">{user.displayName}</div>
                                <div className="text-xs text-gray-500 dark:text-gray-300">{user.email}</div>
                            </div>
                        </div>
                        {menuItems.releaseNotes && <DropdownMenuItem className="space-x-2 cursor-pointer" onClick={() => {
                        }}>
                            <FaNewspaper className='size-4 text-black dark:text-white' />
                            <span>Whats New ✨</span>
                        </DropdownMenuItem>
                        }
                        {menuItems.github && <DropdownMenuItem className="space-x-2 cursor-pointer" onClick={() => {
                            window.open(process.env.NEXT_PUBLIC_GITHUB_REPO ?? '', '_blank');
                        }}>
                            <FaGithub className='size-4 text-black dark:text-white' />
                            <span>GitHub</span>
                        </DropdownMenuItem>
                        }
                        {menuItems.report && <DropdownMenuItem className="space-x-2 cursor-pointer" onClick={() => {
                            window.open(`${process.env.NEXT_PUBLIC_GITHUB_REPO}/issues/new`, '_blank');
                        }}>
                            <FaBug className='size-4 text-black dark:text-white' />
                            <span>Report a Bug</span>
                        </DropdownMenuItem>}
                        {menuItems.tour && <DropdownMenuItem className="space-x-2 cursor-pointer" onClick={async () => {
                            setNewUser(true);
                            router.push('/');
                        }}>
                            <FaWpexplorer className='size-4 text-black dark:text-white' />
                            <span>Take a Tour</span>
                        </DropdownMenuItem>}
                        <DropdownMenuItem className='space-x-2 cursor-pointer' onClick={onLogOut}>
                            <ExitIcon />
                            <span>Log out</span>
                            {/* <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut> */}
                        </DropdownMenuItem>
                    </DropdownMenuContent>

                </DropdownMenu>
            ) : (
                <HoverCard>
                    <HoverCardTrigger>
                        <div className='cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-800 p-2 rounded-lg'>
                            <div className='cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-800 p-2 rounded-lg'
                                onClick={() => {
                                    // on small screens login
                                    if (window.innerWidth < 768) {
                                        onLogin();
                                    }
                                }}
                            >
                                <FaGoogle className={Constants.styles.iconTheme} />
                            </div>
                        </div>
                    </HoverCardTrigger>
                    <HoverCardContent className="w-60 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg transition-all duration-300">
                        <div className="text-sm text-black dark:text-white">
                            Sign in to sync notes with cloud
                        </div>
                        <button
                            className="mt-4 w-full py-2 text-sm font-medium text-center text-white bg-blue-500 rounded-lg hover:bg-blue-600"
                            onClick={onLogin}
                        >
                            <FaGoogle className='inline-block mr-2' /> Sign in with Google
                        </button>
                    </HoverCardContent>
                </HoverCard>
            )
            }
        </div >
    );
}

export default LoginMenu;