import { Button } from "@nextui-org/button";
import { useTheme } from "next-themes";
import { useState } from "react";
import Editor from "./Editor";
import PSInput from "./PSInput";
import PSNavbar from "./PSNavbar";

export default function Pastelog() {
    const { theme } = useTheme();
    const [description, setDescription] = useState<string>('');
    const [content, setContent] = useState<string>('');
    const [preview, setPreview] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const selected = 'bg-indigo-800 text-slate-50';
    const unSelected = 'text-black bg-indigo-300';

    function publish() {
        setLoading(true);
        // Publish the pastelog
        // ...
        setTimeout(() => {
            setLoading(false);
        }, 5000);
    }

    return (
        <>
            <PSNavbar />
            <div className="min-h-screen">
                <div
                    aria-disabled={loading}
                    className="flex flex-col items-center sm:px-4 w-full">
                    <PSInput
                        className="my-2 dark:bg-gray-800"
                        placeHolder="Pastelog Description"
                        value={description}
                        onChange={(e) => { setDescription(e.target.value) }}
                    />
                    <div className="flex flex-col items-center w-full md:w-3/4 lg:w-2/3 border-black rounded-lg bg-indigo-500 dark:bg-gray-800">
                        <div className="flex flex-row justify-start w-full h-12 mb-1">
                            <Button
                                className={`rounded-tl-lg rounded-bl-none rounded-r-none ${!preview ? selected : unSelected}`}
                                size="lg"
                                onClick={() => setPreview(false)}
                            >Edit</Button>
                            <Button
                                className={`rounded-l-none rounded-r-lg ${preview ? selected : unSelected}`}
                                size="lg"
                                onClick={() => setPreview(true)}
                            >Preview</Button>
                        </div>
                        <div className="w-full max-w-none px-1 prose prose-indigo dark:prose-dark">
                            <Editor
                                preview={preview}
                                className={theme != 'dark' ? ` bg-slate-200 text-black` : `bg-gray-700 text-white`}
                                value={content}
                                onChange={(e) => { setContent(e.target.value) }}
                            />
                        </div>
                    </div>

                    <div className="flex w-full md:w-3/4 lg:w-2/3 justify-end my-4 px-2">
                        <Button color="primary"
                            onClick={publish}
                            isLoading={loading}>
                            <div className="px-4">
                                Publish
                            </div>
                        </Button>
                    </div>
                </div >
            </div >
        </>
    );
}
