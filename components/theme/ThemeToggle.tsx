"use client"

import {useTheme} from "next-themes";
import Button from "@/components/common/Button";
import {Sun, Moon} from "lucide-react";

export const ThemeToggle = () => {
    const {resolvedTheme, setTheme} = useTheme();
    const isDark = resolvedTheme === "dark";

    return (
        <Button
            size="icon"
            buttonHandler={() => {
                setTheme(isDark ? "light" : "dark");
            }
            }
            icon={isDark ? <Sun/> : <Moon/>}
        >
        </Button>
    );
};
