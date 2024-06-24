import React, { useEffect, useRef, useState } from 'react';

type BannerProps = {
    children?: React.ReactNode;
    message: string;
    className?: string;
    show: boolean;
};

const Banner: React.FC<BannerProps> = ({ children, message, className, show }) => {
    const [height, setHeight] = useState<number | undefined>(undefined);
    const contentRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (contentRef.current) {
            setHeight(contentRef.current.scrollHeight);
        }
    }, [message, children]);

    return (
        <div
            className={`overflow-hidden transition-all duration-300 ease-in-out ${className}`}
            style={{
                maxHeight: show ? height : 0,
                opacity: show ? 1 : 0,
                transform: show ? 'translateY(0)' : 'translateY(-100%)',
            }}
        >
            <div ref={contentRef} className="flex items-center justify-center text-center bg-emerald-600">
                <div className='grow'><p>{message}</p></div>
                {children}
            </div>
        </div>
    );
};

export default Banner;