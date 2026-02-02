import { useEffect } from 'react';
import { useAdvanceTheme } from '@/hooks/useAdvanceTheme';
import { TranscriptPanel, AIChatPanel, ControlBar } from '@/components/transcript';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

/**
 * Main component for Advance Layout theme
 * Integrates all features: listening, transcript, AI chat, screenshot analysis
 */
export const AdvanceLayoutMain = () => {
    const {
        listeningState,
        startListening,
        pauseListening,
        resumeListening,
        stopListening,
        messages,
        clearTranscript,
        copyTranscript,
        aiChatVisible,
        toggleAiChat,
        aiResponse,
        isAIProcessing,
        handleScreenshotAnalysis,
        error,
    } = useAdvanceTheme();

    // Listen for Ctrl+Enter keyboard shortcut
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.ctrlKey && e.key === 'Enter') {
                e.preventDefault();
                handleScreenshotAnalysis();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleScreenshotAnalysis]);

    return (
        <div className="flex h-full w-full flex-col">
            {/* Control Bar */}
            <ControlBar
                listeningStatus={listeningState.status}
                onStartListening={startListening}
                onPauseListening={pauseListening}
                onResumeListening={resumeListening}
                onStopListening={stopListening}
                onToggleAiChat={toggleAiChat}
                onCopyTranscript={copyTranscript}
                onClearTranscript={clearTranscript}
                aiChatVisible={aiChatVisible}
                hasMessages={messages.length > 0}
            />

            {/* Error Alert */}
            {error && (
                <div className="px-4 pt-4">
                    <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                </div>
            )}

            {/* Main Content Area */}
            <div className="flex flex-1 overflow-hidden">
                {/* Transcript Panel */}
                <div className={aiChatVisible ? 'flex-1' : 'w-full'}>
                    <TranscriptPanel messages={messages} className="h-full" />
                </div>

                {/* AI Chat Panel */}
                {aiChatVisible && (
                    <div className="w-96">
                        <AIChatPanel
                            visible={aiChatVisible}
                            onToggle={toggleAiChat}
                            response={aiResponse}
                            isProcessing={isAIProcessing}
                            className="h-full"
                        />
                    </div>
                )}
            </div>

            {/* Helper Text at Bottom */}
            {messages.length === 0 && listeningState.status === 'idle' && (
                <div className="border-t border-border bg-muted/30 px-4 py-3">
                    <div className="flex items-center justify-center gap-6 text-xs text-muted-foreground">
                        <div className="flex items-center gap-2">
                            <kbd className="px-2 py-1 bg-background rounded border">Ctrl+Enter</kbd>
                            <span>Screenshot + AI Analysis</span>
                        </div>
                        <div className="h-4 w-px bg-border" />
                        <div className="flex items-center gap-2">
                            <span>Click "Start Listening" to begin transcription</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
