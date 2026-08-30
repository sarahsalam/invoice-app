"use client"

import {useTheme} from "next-themes";
import Button from "@/components/common/Button";
import {Sun, Moon } from "lucide-react";

export const ThemeToggle = () => {
    const {resolvedTheme, setTheme} = useTheme();
    const isDark = resolvedTheme === "dark";

    return (
        <Button
            size="icon"
            bgColor="bg-transparent"
            classes="text-[#858bb3] hover:bg-transparent hover:text-white"
            buttonHandler={() => {
                setTheme(isDark ? "light" : "dark");
            }
            }
            icon={isDark ? <Sun /> : <Moon />}
        >
        </Button>
    );
};
