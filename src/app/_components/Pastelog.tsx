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

    const selected = 'bg-indigo-800 text-slate-50 dark:bg-gray-700 dark:text-slate-50';
    const unSelected = 'text-black bg-indigo-300 dark:bg-gray-900 dark:text-slate-50 ';

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
            <div className="min-h-screen relative">
                {loading && (
                    <div className="absolute inset-0 bg-gray-700 bg-opacity-50 flex items-center justify-center z-50">
                        <div className="loader" />
                        {/* Publishing...</div> */}
                    </div>
                )}
                <div
                    aria-disabled={loading}
                    className={`flex flex-col items-center sm:px-4 w-full ${loading ? 'pointer-events-none' : ''}`}>
                    <PSInput
                        className="my-2 dark:bg-gray-800"
                        placeHolder="Pastelog Description"
                        value={description}
                        onChange={(e) => { setDescription(e.target.value) }}
                        disabled={loading}
                    />
                    <div className="flex flex-col items-center w-full md:w-3/4 lg:w-2/3 border-black rounded-lg bg-indigo-500 dark:bg-gray-800">
                        <div className="flex flex-row justify-start w-full h-12 mb-1">
                            <Button
                                className={`rounded-tl-lg rounded-bl-none rounded-r-none ${!preview ? selected : unSelected}`}
                                size="lg"
                                onClick={() => setPreview(false)}
                                disabled={loading}
                            >Edit</Button>
                            <Button
                                className={`rounded-l-none rounded-r-lg ${preview ? selected : unSelected}`}
                                size="lg"
                                onClick={() => setPreview(true)}
                                disabled={loading}
                            >Preview</Button>
                        </div>
                        <div className="w-full max-w-none px-1 prose prose-indigo dark:prose-dark">
                            <Editor
                                preview={preview}
                                className={theme != 'dark' ? ` bg-slate-200 text-black` : `bg-gray-700 text-white`}
                                value={content}
                                onChange={(e) => { setContent(e.target.value) }}
                                disabled={loading}
                            />
                        </div>
                    </div>
                    {
                        !preview && (
                            <div className="flex w-full md:w-3/4 lg:w-2/3 justify-end my-4 px-2">
                                <Button
                                    className="bg-gradient-to-r from-indigo-500 to-indigo-600"
                                    onClick={publish}
                                    isLoading={loading}
                                    disabled={loading}
                                >
                                    <div className="px-4 text-white">
                                        {
                                            loading ? 'Publishing...' :
                                                'Publish'}
                                    </div>
                                </Button>
                            </div>
                        )}
                    <div
                        className="h-32"
                    />
                </div >
            </div >
        </>
    );
}
