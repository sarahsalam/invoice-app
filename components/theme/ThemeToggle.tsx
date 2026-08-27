"use client"

import {useTheme} from "next-themes";
import {Button} from "@/components/ui/button";
import {Sun, Moon} from "lucide-react";

export const ThemeToggle = () => {
    const {resolvedTheme, setTheme} = useTheme();
    const isDark = resolvedTheme === "dark";

    return (
        <Button
            size="icon"
            onClick={() => {
                setTheme(isDark ? "light" : "dark");
            }
            }
        >
            {isDark ? <Sun/> : <Moon/>}
        </Button>
    );
};
