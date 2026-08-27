"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";

const STATUS_OPTIONS = ["all", "draft", "pending", "paid"];

interface StatusFilterProps {
    selected: string[];
    onChange: (statuses: string[]) => void;
}

export default function StatusFilter({ selected, onChange }: StatusFilterProps) {
    const [isOpen, setIsOpen] = useState(false);
    const filterRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!isOpen) return;

        function handlePointerDown(event: PointerEvent) {
            if (!filterRef.current?.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }

        document.addEventListener("pointerdown", handlePointerDown);
        return () => document.removeEventListener("pointerdown", handlePointerDown);
    }, [isOpen]);

    function toggle(status:string){
        onChange([status]);
    }

    return (
        <div ref={filterRef} className="relative">
            <button
                type="button"
                onClick={() => setIsOpen((open) => !open)}
                className="flex items-center gap-1 text-right text-sm font-semibold sm:gap-2 sm:text-base"
                aria-expanded={isOpen}
            >
                Filter by status
                <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
            </button>

            {isOpen && (
                <div className="absolute left-0 z-10 mt-3 w-40 max-w-[calc(100vw-2rem)] rounded-lg bg-popover p-4 text-popover-foreground shadow-lg sm:right-0 sm:left-auto">
                    {STATUS_OPTIONS.map((status) => (
                        <label key={status} className="flex cursor-pointer items-center gap-2 py-1.5 text-sm">
                            <input
                                type="checkbox"
                                checked={selected.includes(status)}
                                onChange={() => toggle(status)}
                                className="accent-purple-600"
                            />
                            <span className="capitalize">{status}</span>
                        </label>
                    ))}
                </div>
            )}
        </div>
    );
}