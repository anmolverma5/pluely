import { Button } from "@/components";
import { RotateCcw } from "lucide-react";
import { invoke } from "@tauri-apps/api/core";
import { useState, useEffect, useCallback } from "react";
import { useGlobalShortcuts } from "@/hooks";

export const ResetPosition = () => {
    const [isResetting, setIsResetting] = useState(false);
    const { registerCustomShortcutCallback, unregisterCustomShortcutCallback } = useGlobalShortcuts();

    const handleResetPosition = useCallback(async () => {
        try {
            setIsResetting(true);
            await invoke("reset_window_position");
            // Small delay to show feedback
            setTimeout(() => setIsResetting(false), 500);
        } catch (error) {
            console.error("Failed to reset window position:", error);
            setIsResetting(false);
        }
    }, []);

    // Register the keyboard shortcut
    useEffect(() => {
        registerCustomShortcutCallback("reset_position", handleResetPosition);

        return () => {
            unregisterCustomShortcutCallback("reset_position");
        };
    }, [registerCustomShortcutCallback, unregisterCustomShortcutCallback, handleResetPosition]);

    return (
        <div className="space-y-2">
            <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                    <label className="text-sm font-medium">Window Position</label>
                    <p className="text-xs text-muted-foreground">
                        Reset window to center of screen (Ctrl+R)
                    </p>
                </div>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={handleResetPosition}
                    disabled={isResetting}
                    className="gap-2"
                >
                    <RotateCcw className={`h-4 w-4 ${isResetting ? "animate-spin" : ""}`} />
                    {isResetting ? "Resetting..." : "Reset Position"}
                </Button>
            </div>
        </div>
    );
};
