import { useCallback, useState } from "react";

interface ISettings {
    newUser: boolean;
}

function initState(): ISettings {
    if (typeof window !== 'undefined') {
        const f = localStorage.getItem(`${process.env.NEXT_PUBLIC_NEW_USER_VISITED}`) ?? 'true';
        const firstVisit = f === 'true';
        return {
            newUser: firstVisit
        }
    }
    return {
        newUser: true,
    }
}

const useSettings = () => {
    const [settings, setSettings] = useState<ISettings>(initState);

    const toggleNewUser = useCallback(() => {
        const newUser = !settings.newUser;
        localStorage.setItem(`${process.env.NEXT_PUBLIC_NEW_USER_VISITED}`, newUser ? 'true' : 'false');
        setSettings({ newUser });
    }, []);

    const setNewUser = useCallback((newUser: boolean) => {
        localStorage.setItem(`${process.env.NEXT_PUBLIC_NEW_USER_VISITED}`, newUser ? 'true' : 'false');
        setSettings({ newUser });
    }, []);

    return {
        settings,
        toggleNewUser,
        setNewUser
    }
}


export default useSettings;
