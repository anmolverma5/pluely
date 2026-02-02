import { Button } from '@/components/ui/button';
import {
    Mic,
    Pause,
    Square,
    Eye,
    EyeOff,
    Copy,
    Trash2,
    Play,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { ListeningStatus } from '@/types/transcript.types';

interface ControlBarProps {
    listeningStatus: ListeningStatus;
    onStartListening: () => void;
    onPauseListening: () => void;
    onResumeListening: () => void;
    onStopListening: () => void;
    onToggleAiChat: () => void;
    onCopyTranscript: () => void;
    onClearTranscript: () => void;
    aiChatVisible: boolean;
    hasMessages: boolean;
}

export const ControlBar = ({
    listeningStatus,
    onStartListening,
    onPauseListening,
    onResumeListening,
    onStopListening,
    onToggleAiChat,
    onCopyTranscript,
    onClearTranscript,
    aiChatVisible,
    hasMessages,
}: ControlBarProps) => {
    const isListening = listeningStatus === 'listening';
    const isPaused = listeningStatus === 'paused';
    const isIdle = listeningStatus === 'idle';

    return (
        <div className="flex items-center justify-between border-b border-border bg-background px-4 py-3">
            {/* Left: Listening controls */}
            <div className="flex items-center gap-2">
                {isIdle && (
                    <Button
                        onClick={onStartListening}
                        className="bg-blue-600 hover:bg-blue-700"
                        size="sm"
                    >
                        <Mic className="mr-2 h-4 w-4" />
                        Start Listening
                    </Button>
                )}

                {(isListening || isPaused) && (
                    <div className="flex items-center gap-2">
                        {isListening && (
                            <Button
                                onClick={onPauseListening}
                                variant="outline"
                                size="sm"
                                className="border-orange-500 text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-950"
                            >
                                <Pause className="mr-2 h-4 w-4" />
                                Pause
                            </Button>
                        )}

                        {isPaused && (
                            <Button
                                onClick={onResumeListening}
                                variant="outline"
                                size="sm"
                                className="border-green-500 text-green-600 hover:bg-green-50 dark:hover:bg-green-950"
                            >
                                <Play className="mr-2 h-4 w-4" />
                                Resume
                            </Button>
                        )}

                        <Button
                            onClick={onStopListening}
                            variant="outline"
                            size="sm"
                            className="border-red-500 text-red-600 hover:bg-red-50 dark:hover:bg-red-950"
                        >
                            <Square className="mr-2 h-4 w-4" />
                            Stop
                        </Button>

                        {/* Status indicator */}
                        <div className="flex items-center gap-2 ml-2 px-3 py-1 rounded-full bg-muted">
                            <div
                                className={cn(
                                    'h-2 w-2 rounded-full',
                                    isListening ? 'bg-green-500 animate-pulse' : 'bg-orange-500'
                                )}
                            />
                            <span className="text-xs font-medium">
                                {isListening ? 'Listening...' : 'Paused'}
                            </span>
                        </div>
                    </div>
                )}
            </div>

            {/* Right: Utility controls */}
            <div className="flex items-center gap-2">
                <Button
                    onClick={onToggleAiChat}
                    variant="ghost"
                    size="sm"
                    title={aiChatVisible ? 'Hide AI Chat' : 'Show AI Chat'}
                >
                    {aiChatVisible ? (
                        <EyeOff className="h-4 w-4" />
                    ) : (
                        <Eye className="h-4 w-4" />
                    )}
                </Button>

                <Button
                    onClick={onCopyTranscript}
                    variant="ghost"
                    size="sm"
                    disabled={!hasMessages}
                    title="Copy Transcript"
                >
                    <Copy className="h-4 w-4" />
                </Button>

                <Button
                    onClick={onClearTranscript}
                    variant="ghost"
                    size="sm"
                    disabled={!hasMessages}
                    title="Clear Transcript"
                >
                    <Trash2 className="h-4 w-4" />
                </Button>
            </div>
        </div>
    );
};
