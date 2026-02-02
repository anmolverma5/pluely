import { Button } from '@/components/ui/button';
import { Mic, Pause, Play, Square, Eye, EyeOff } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AdvanceTopBarProps {
    listeningStatus: 'idle' | 'listening' | 'paused';
    onStartListening: () => void;
    onPauseListening: () => void;
    onResumeListening: () => void;
    onStopListening: () => void;
    transcriptVisible: boolean;
    onToggleTranscript: () => void;
}

export const AdvanceTopBar = ({
    listeningStatus,
    onStartListening,
    onPauseListening,
    onResumeListening,
    onStopListening,
    transcriptVisible,
    onToggleTranscript,
}: AdvanceTopBarProps) => {
    const isListening = listeningStatus === 'listening';
    const isPaused = listeningStatus === 'paused';
    const isIdle = listeningStatus === 'idle';

    return (
        <div className="flex items-center justify-between gap-2 px-3 py-2 border-b border-border bg-background/95 backdrop-blur">
            {/* Left: Listening controls */}
            <div className="flex items-center gap-2">
                {isIdle && (
                    <Button
                        onClick={onStartListening}
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                        size="sm"
                    >
                        <Mic className="mr-2 h-4 w-4" />
                        Start Listening
                    </Button>
                )}

                {isListening && (
                    <>
                        <Button
                            onClick={onPauseListening}
                            variant="outline"
                            className="bg-orange-600 hover:bg-orange-700 text-white border-orange-600"
                            size="sm"
                        >
                            <Pause className="mr-2 h-4 w-4" />
                            Pause
                        </Button>
                        <Button
                            onClick={onStopListening}
                            variant="outline"
                            className="bg-red-600 hover:bg-red-700 text-white border-red-600"
                            size="sm"
                        >
                            <Square className="mr-2 h-4 w-4" />
                            Stop
                        </Button>
                    </>
                )}

                {isPaused && (
                    <>
                        <Button
                            onClick={onResumeListening}
                            variant="outline"
                            className="bg-green-600 hover:bg-green-700 text-white border-green-600"
                            size="sm"
                        >
                            <Play className="mr-2 h-4 w-4" />
                            Resume
                        </Button>
                        <Button
                            onClick={onStopListening}
                            variant="outline"
                            className="bg-red-600 hover:bg-red-700 text-white border-red-600"
                            size="sm"
                        >
                            <Square className="mr-2 h-4 w-4" />
                            Stop
                        </Button>
                    </>
                )}

                {/* Status indicator */}
                {!isIdle && (
                    <div className="flex items-center gap-2 ml-2">
                        <div
                            className={cn(
                                'h-2 w-2 rounded-full animate-pulse',
                                isListening && 'bg-green-500',
                                isPaused && 'bg-orange-500'
                            )}
                        />
                        <span className="text-sm text-muted-foreground">
                            {isListening ? 'Listening...' : 'Paused'}
                        </span>
                    </div>
                )}
            </div>

            {/* Right: Toggle transcript visibility */}
            <Button
                onClick={onToggleTranscript}
                variant="ghost"
                size="sm"
                className="gap-2"
            >
                {transcriptVisible ? (
                    <>
                        <EyeOff className="h-4 w-4" />
                        Hide
                    </>
                ) : (
                    <>
                        <Eye className="h-4 w-4" />
                        Show
                    </>
                )}
            </Button>
        </div>
    );
};
