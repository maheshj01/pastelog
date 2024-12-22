import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from './accordion';

interface PSAccordionProps {
    id: string;
    title: string;
    className?: string;
    children: React.ReactNode;
}

export default function PSAccordion({ id, title, children, className }: PSAccordionProps) {
    return (
        <Accordion
            className={className}
            type="single" collapsible>
            <AccordionItem value={id}>
                <AccordionTrigger className='dark:text-white p-0'>{title}</AccordionTrigger>
                <AccordionContent>
                    {children}
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    );
}