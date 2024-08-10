"use client";

import { MoonIcon, SunIcon } from "@radix-ui/react-icons";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";

export default function ThemeToggler() {
  const { theme, setTheme } = useTheme();

  const SWITCH = () => {
    switch (theme) {
      case "light":
        setTheme("dark");
        break;
      case "dark":
        setTheme("light");
        break;
      default:
        break;
    }
  };

  const TOGGLE_THEME = () => {
    //@ts-ignore
    if (!document.startViewTransition) SWITCH();

    //@ts-ignore
    document.startViewTransition(SWITCH);
  };

  return (
    <Button
      onClick={TOGGLE_THEME}
      variant="outline"
      size="sm"
      className="rounded size-8 p-0"
    >
      <SunIcon className="rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <MoonIcon className="absolute rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
