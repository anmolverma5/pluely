import { useState } from "react";
import { Button } from "@/components";
import { Check, Settings2 } from "lucide-react";
import { safeLocalStorage } from "@/lib";
import { STORAGE_KEYS } from "@/config/constants";
import { cn } from "@/lib/utils";

type LayoutType = "default" | "advance";

export const AppLayoutSelector = () => {
    const savedLayout = safeLocalStorage.getItem(STORAGE_KEYS.DASHBOARD_LAYOUT) as LayoutType || "default";
    const [selectedLayout, setSelectedLayout] = useState<LayoutType>(savedLayout);

    const handleLayoutChange = async (layout: LayoutType) => {
        setSelectedLayout(layout);
        safeLocalStorage.setItem(STORAGE_KEYS.DASHBOARD_LAYOUT, layout);

        // Reload the window to apply new layout
        window.location.reload();
    };

    return (
        <div className="absolute top-2 right-2 z-50 flex items-center gap-2 rounded-lg border border-input/50 bg-background/95 backdrop-blur-sm p-1 shadow-lg">
            <Settings2 className="h-3 w-3 text-muted-foreground ml-2" />
            <Button
                variant={selectedLayout === "default" ? "default" : "ghost"}
                size="sm"
                onClick={() => handleLayoutChange("default")}
                className={cn(
                    "h-7 text-xs",
                    selectedLayout === "default" && "pointer-events-none"
                )}
            >
                {selectedLayout === "default" && <Check className="mr-1 h-3 w-3" />}
                Default
            </Button>

            <Button
                variant={selectedLayout === "advance" ? "default" : "ghost"}
                size="sm"
                onClick={() => handleLayoutChange("advance")}
                className={cn(
                    "h-7 text-xs",
                    selectedLayout === "advance" && "pointer-events-none"
                )}
            >
                {selectedLayout === "advance" && <Check className="mr-1 h-3 w-3" />}
                Advance
            </Button>
        </div>
    );
};
