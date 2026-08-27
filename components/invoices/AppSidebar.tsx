"use client"
import Image from 'next/image';
import {ThemeToggle} from "@/components/theme/ThemeToggle";

export const AppSidebar = () => {
    return (
        <aside className="fixed inset-x-0 top-0 z-20 flex h-20 items-center justify-between bg-[rgb(55,59,83)] px-6 md:inset-y-0 md:right-auto md:h-auto md:w-[103px] md:flex-col md:justify-start md:rounded-r-3xl md:px-0">
            <div className="h-20 w-20 md:h-[103px] md:w-[103px]">
                <Image
                    src="/assets/logo.svg"
                    width={103}
                    height={103}
                    alt="Logo"
                    className="h-full w-full"
                />
            </div>
            <div className="flex items-center gap-5 md:mt-auto md:mb-6 md:flex-col md:gap-9">
                <ThemeToggle/>
                <div className="h-11 w-11 rounded-full border border-white/40 bg-white/10" />
            </div>
        </aside>
    )
}