"use client"
import Image from 'next/image';
import {ThemeToggle} from "@/components/theme/ThemeToggle";
import { profileImage } from "@/lib/profileImage";

export const AppSidebar = () => {
    return (
        <aside className="fixed inset-x-0 top-0 z-20 flex h-20 items-center justify-between bg-[rgb(55,59,83)] dark:bg-[#1E2139] px-6 md:inset-y-0 md:right-auto md:h-auto md:w-[103px] md:flex-col md:justify-start md:rounded-r-3xl md:px-0">
            <div className="h-20 w-20 md:h-[103px] md:w-[103px]">
                <Image
                    src="/assets/logo.svg"
                    width={103}
                    height={103}
                    alt="Logo"
                    className="h-full w-full"
                />
            </div>

            <div className="flex items-center gap-5 md:mt-auto md:mb-0 md:w-full md:flex-col md:gap-6">
                <ThemeToggle/>
                <div className="hidden h-px w-full bg-white/10 md:block" />
                <Image
                    src={profileImage}
                    width={32}
                    height={32}
                    alt="Profile"
                    className="mb-6 h-10 w-10 rounded-full object-cover"
                />
            </div>
        </aside>
    )
}