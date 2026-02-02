import { Button } from "@/components";
import { Mic, Pause, Square, Eye, Grid3x3, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface AdvanceThemeTopBarProps {
    isListening: boolean;
    isPaused: boolean;
    onStartListening: () => void;
    onPause: () => void;
    onStop: () => void;
    onToggleVisibility: () => void;
    onMenu: () => void;
    onClose: () => void;
}

export const AdvanceThemeTopBar = ({
    isListening,
    isPaused,
    onStartListening,
    onPause,
    onStop,
    onToggleVisibility,
    onMenu,
    onClose,
}: AdvanceThemeTopBarProps) => {
    return (
        <div className="flex items-center justify-between border-b border-border bg-background px-4 py-2">
            <div className="flex items-center gap-2">
                {!isListening ? (
                    <Button
                        onClick={onStartListening}
                        className="bg-blue-600 hover:bg-blue-700"
                        size="sm"
                    >
                        <Mic className="mr-2 h-4 w-4" />
                        Start Listening
                    </Button>
                ) : (
                    <div className="flex items-center gap-2">
                        <Button
                            onClick={onPause}
                            variant="outline"
                            size="sm"
                            className={cn(isPaused && "bg-accent")}
                        >
                            <Pause className="h-4 w-4" />
                        </Button>
                        <Button
                            onClick={onStop}
                            variant="outline"
                            size="sm"
                        >
                            <Square className="h-4 w-4" />
                        </Button>
                    </div>
                )}
            </div>

            <div className="flex items-center gap-2">
                <Button
                    onClick={onToggleVisibility}
                    variant="ghost"
                    size="sm"
                >
                    <Eye className="h-4 w-4" />
                </Button>
                <Button
                    onClick={onMenu}
                    variant="ghost"
                    size="sm"
                >
                    <Grid3x3 className="h-4 w-4" />
                </Button>
                <Button
                    onClick={onClose}
                    variant="ghost"
                    size="sm"
                >
                    <X className="h-4 w-4" />
                </Button>
            </div>
        </div>
    );
};
