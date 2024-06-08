import { useEffect, useState } from "react";
import Log from "../_models/Log";
import LogService from "../_services/logService";

export default function Sidebar() {
    const [logs, setLogs] = useState<Log[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    async function fetchLogs() {
        setLoading(true);
        const logService = new LogService();
        const logs = await logService.fetchLogs();
        setLogs(logs);
        setLoading(false);
    }

    useEffect(() => {
        fetchLogs();
    }, [])

    return (
        <div>

        </div>
    );
}