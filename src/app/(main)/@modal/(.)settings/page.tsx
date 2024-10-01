"use client";
import { Card, CardHeader } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import React from "react";
import { Dialog, DialogContent } from "../../_components/dialog";

const SettingsModal: React.FC = () => {
    const router = useRouter();
    return (
        <Dialog open={true} onOpenChange={() => router.back()}>
            <DialogContent className="lg:w-[700px] bg-transparent border-0 text-transparent ">
                <Card className="bg-light-gray-800 dark:bg-dark-gray-800 border border-light-gray-700 dark:border-dark-gray-700 lg:w-[550px]">
                    <CardHeader className="text-2xl">
                        <p className="text-4xl">Settings</p>
                        <p className="text-xl">
                            Add a quote to our list of quotes with one click.
                        </p>
                    </CardHeader>
                </Card>
            </DialogContent>
        </Dialog>
    );
};

export default SettingsModal;