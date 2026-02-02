import { useState, useEffect } from "react";
import { Button } from "@/components";
import { safeLocalStorage } from "@/lib";
import { STORAGE_KEYS } from "@/config/constants";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

type LayoutType = "default" | "advance";

export const LayoutSelector = () => {
    const [selectedLayout, setSelectedLayout] = useState<LayoutType>("default");

    // Load saved layout preference on mount
    useEffect(() => {
        const savedLayout = safeLocalStorage.getItem(STORAGE_KEYS.DASHBOARD_LAYOUT);
        if (savedLayout === "advance" || savedLayout === "default") {
            setSelectedLayout(savedLayout);
        }
    }, []);

    const handleLayoutChange = (layout: LayoutType) => {
        setSelectedLayout(layout);
        safeLocalStorage.setItem(STORAGE_KEYS.DASHBOARD_LAYOUT, layout);

        // Trigger a page reload to apply the new layout
        window.location.reload();
    };

    return (
        <div className="space-y-4 rounded-lg border border-input/50 p-4">
            <div className="space-y-1">
                <h3 className="text-sm font-medium">Dashboard Layout</h3>
                <p className="text-xs text-muted-foreground">
                    Choose your preferred dashboard layout style
                </p>
            </div>

            <div className="flex gap-3">
                <Button
                    variant={selectedLayout === "default" ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleLayoutChange("default")}
                    className={cn(
                        "flex items-center gap-2",
                        selectedLayout === "default" && "pointer-events-none"
                    )}
                >
                    {selectedLayout === "default" && <Check className="h-4 w-4" />}
                    Default Layout
                </Button>

                <Button
                    variant={selectedLayout === "advance" ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleLayoutChange("advance")}
                    className={cn(
                        "flex items-center gap-2",
                        selectedLayout === "advance" && "pointer-events-none"
                    )}
                >
                    {selectedLayout === "advance" && <Check className="h-4 w-4" />}
                    Advance Theme
                </Button>
            </div>
        </div>
    );
};
