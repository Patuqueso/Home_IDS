import { cn } from "@/lib/utils";

interface UniversalSectionProps {
    children: React.ReactNode;
    className?: string;
}

export const UniversalSection = ({ children ,className}: UniversalSectionProps) => {
    return (
        <section className={cn("w-full h-fit px-5 md:px-7 lg:px-14 xl:px-36 2xl:px-56 flex items-start justify-start", className)}>
            {children}
        </section>
    );
};