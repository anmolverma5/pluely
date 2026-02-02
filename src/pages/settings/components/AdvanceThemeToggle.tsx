import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { safeLocalStorage } from "@/lib";
import { STORAGE_KEYS } from "@/config/constants";
import { cn } from "@/lib/utils";

type LayoutType = "default" | "advance";

export const AdvanceThemeToggle = () => {
    const savedLayout = safeLocalStorage.getItem(STORAGE_KEYS.APP_LAYOUT) as LayoutType || "default";
    const [selectedLayout, setSelectedLayout] = useState<LayoutType>(savedLayout);

    const handleLayoutChange = (layout: LayoutType) => {
        setSelectedLayout(layout);
        safeLocalStorage.setItem(STORAGE_KEYS.APP_LAYOUT, layout);

        // Reload to apply new layout
        window.location.reload();
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>App Layout</CardTitle>
                <CardDescription>
                    Choose between default layout or advance theme layout
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex gap-3">
                    <Button
                        variant={selectedLayout === "default" ? "default" : "outline"}
                        onClick={() => handleLayoutChange("default")}
                        className={cn(
                            "flex-1",
                            selectedLayout === "default" && "pointer-events-none"
                        )}
                    >
                        {selectedLayout === "default" && <Check className="mr-2 h-4 w-4" />}
                        Default Layout
                    </Button>

                    <Button
                        variant={selectedLayout === "advance" ? "default" : "outline"}
                        onClick={() => handleLayoutChange("advance")}
                        className={cn(
                            "flex-1",
                            selectedLayout === "advance" && "pointer-events-none"
                        )}
                    >
                        {selectedLayout === "advance" && <Check className="mr-2 h-4 w-4" />}
                        Advance Theme
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
};
