"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";

const STATUS_OPTIONS = ["all", "pending", "draft", "paid"];

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
                className="flex items-center gap-1 text-right text-xs font-bold sm:gap-2"
                aria-expanded={isOpen}
            >
                Filter by status
                <ChevronDown className={`h-4 w-4 text-[#7c5dfa] font-bold stroke-3 transition-transform ${isOpen ? "rotate-180" : ""}`} />
            </button>

            {isOpen && (
                <div
                    className="
            absolute
            left-1/2
            z-10
            mt-5
            w-[192px]
            -translate-x-1/2
            rounded-lg
            bg-white
            px-6
            py-5
            shadow-lg
            dark:bg-card
            font-bold
        "
                >
                    {STATUS_OPTIONS.map((status) => (
                        <label
                            key={status}
                            className="flex cursor-pointer items-center gap-3 py-1.5 text-xs font-bold"
                        >
                            <input
                                type="checkbox"
                                checked={selected.includes(status)}
                                onChange={() => toggle(status)}
                                className="h-4 w-4 border border-[#dfe3fa] bg-[#dfe3fa] accent-[#7c5dfa]"
                            />

                            <span className="capitalize">
                    {status}
                </span>
                        </label>
                    ))}
                </div>
            )}
        </div>
    );
}