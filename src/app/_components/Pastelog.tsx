import { Button } from "@nextui-org/button";
import { useTheme } from "next-themes";
import { useState } from "react";
import PSContent from "./PSContent";
import PSInput from "./PSInput";
import PSNavbar from "./PSNavbar";
export default function Pastelog() {
    const { theme, setTheme } = useTheme()
    const [description, setDescription] = useState<string>('')
    const [content, setContent] = useState<string>('')
    return (
        <>
            <PSNavbar />
            <div className='min-h-screen'>
                <div
                    className="flex flex-col items-center sm:px-4 w-full">
                    <PSInput
                        className="my-2 dark:bg-gray-800"
                        placeHolder="Pastelog Description"
                        value={description}
                        onChange={(e) => { setDescription(e.target.value) }}
                    />
                    <PSContent
                        className="my-2 dark:bg-gray-800"
                        value={content}
                        onChange={(e) => { setContent(e.target.value) }}
                    />
                    <p>{description}</p>
                    <p>{content}</p>
                    <div className="flex w-full md:w-3/4 lg:w-2/3 justify-end">
                        <Button>Save</Button>
                    </div>
                </div >
            </div >
            {/* <div className="flex flex-col space-y-4 min-h-screen">
                <div className="min-h-screen flex justify-center items-center">
                    {theme === 'dark' ? <h1 className="text-white">Dark Mode</h1> : <h1 className="text-black">Light Mode</h1>}
                </div>
            </div> */}
        </>
    );
}