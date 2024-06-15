import Log from "../_models/Log";

interface SidebarItemProps {
    id: string;
    log: Log;
    selected: boolean;
    onLogClick: (id: Log) => void;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ selected, id, log, onLogClick }) => {
    return (
        <div key={log.id} className="px-2 py-1">
            <div
                className={`text-sm dark:text-slate-200 cursor-pointer py-2 hover:bg-background transition-all duration-100 px-2 rounded-md whitespace-nowrap overflow-hidden text-ellipsis relative ${selected ? 'bg-background' : ''}`}
                onClick={() => onLogClick(log)}
            >
                <span>{log.title!.length === 0 ? log.id : log.title}</span>
                <div className="absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-surface pointer-events-none"></div>
            </div>
        </div>
    );
};

export default SidebarItem;