import { useState, useEffect } from "react";
import { Card, Settings, SystemAudio, Updater } from "./components";
import { Completion } from "./pages/app/components/completion";
import { ChatHistory } from "./components/history";
import { AudioVisualizer } from "./pages/app/components/speech/audio-visualizer";
import { StatusIndicator } from "./pages/app/components/speech/StatusIndicator";
import { useSystemAudio } from "./hooks/useSystemAudio";
import { useTransparency } from "./hooks/useTransparency";
import { useAdvanceTheme } from "./hooks/useAdvanceTheme";
import { AdvanceTopBar } from "./pages/app/components/AdvanceTopBar";
import { TranscriptChatTabs } from "./pages/app/components/TranscriptChatTabs";
import { safeLocalStorage } from "./lib";
import { STORAGE_KEYS } from "./config/constants";
import { Alert, AlertDescription } from "./components/ui/alert";
import { AlertCircle } from "lucide-react";

const App = () => {
  const systemAudio = useSystemAudio();
  useTransparency(); // Apply transparency effects

  // Check if advance theme is enabled
  const [isAdvanceTheme, setIsAdvanceTheme] = useState(false);
  const [transcriptVisible, setTranscriptVisible] = useState(true);

  useEffect(() => {
    const layoutPreference = safeLocalStorage.getItem(STORAGE_KEYS.DASHBOARD_LAYOUT);
    setIsAdvanceTheme(layoutPreference === "advance");
  }, []);

  // Initialize advance theme hook only if enabled
  const advanceTheme = useAdvanceTheme();

  const handleSelectConversation = (conversation: any) => {
    // Use localStorage to communicate the selected conversation to Completion component
    localStorage.setItem("selectedConversation", JSON.stringify(conversation));
    // Trigger a custom event to notify Completion component
    window.dispatchEvent(
      new CustomEvent("conversationSelected", {
        detail: conversation,
      })
    );
  };

  const handleNewConversation = () => {
    // Clear any selected conversation and trigger new conversation
    localStorage.removeItem("selectedConversation");
    window.dispatchEvent(new CustomEvent("newConversation"));
  };

  // Handle Ctrl+Enter keyboard shortcut for advance theme
  useEffect(() => {
    if (!isAdvanceTheme) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.key === 'Enter') {
        event.preventDefault();
        advanceTheme.handleScreenshotAnalysis();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAdvanceTheme, advanceTheme]);

  return (
    <div className="w-screen h-screen flex flex-col overflow-hidden">
      {/* ADVANCE THEME: Top Bar with Listening Controls */}
      {isAdvanceTheme && (
        <AdvanceTopBar
          listeningStatus={advanceTheme.listeningState.status}
          onStartListening={advanceTheme.startListening}
          onPauseListening={advanceTheme.pauseListening}
          onResumeListening={advanceTheme.resumeListening}
          onStopListening={advanceTheme.stopListening}
          transcriptVisible={transcriptVisible}
          onToggleTranscript={() => setTranscriptVisible(!transcriptVisible)}
        />
      )}

      {/* ADVANCE THEME: Transcript/Chat Tabs (Middle Section) */}
      {isAdvanceTheme && transcriptVisible && (
        <div className="flex-1 overflow-hidden">
          {advanceTheme.error && (
            <Alert variant="destructive" className="m-2">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{advanceTheme.error}</AlertDescription>
            </Alert>
          )}
          <TranscriptChatTabs
            messages={advanceTheme.messages}
            aiResponse={advanceTheme.aiResponse}
            isAIProcessing={advanceTheme.isAIProcessing}
            onCopyTranscript={advanceTheme.copyTranscript}
            className="h-full"
          />
        </div>
      )}

      {/* BOTTOM SECTION: Existing Input + Controls (Always Visible) */}
      <div className={isAdvanceTheme && transcriptVisible ? "" : "flex items-center justify-center flex-1"}>
        <Card className="w-full flex flex-row items-center gap-2 p-2">
          <SystemAudio {...systemAudio} />
          {systemAudio?.capturing ? (
            <div className="flex flex-row items-center gap-2 justify-between w-full">
              <div className="flex flex-1 items-center gap-2">
                <AudioVisualizer isRecording={systemAudio?.capturing} stream={systemAudio?.stream || null} />
              </div>
              <div className="flex !w-fit items-center gap-2">
                <StatusIndicator
                  setupRequired={systemAudio.setupRequired}
                  error={systemAudio.error}
                  isProcessing={systemAudio.isProcessing}
                  isAIProcessing={systemAudio.isAIProcessing}
                  capturing={systemAudio.capturing}
                />
              </div>
            </div>
          ) : null}

          <div
            className={`${systemAudio?.capturing
                ? "hidden w-full fade-out transition-all duration-300"
                : "w-full flex flex-row gap-2 items-center"
              }`}
          >
            <Completion isHidden={false} />
            <ChatHistory
              onSelectConversation={handleSelectConversation}
              onNewConversation={handleNewConversation}
              currentConversationId={null}
            />
            <Settings />
          </div>

          <Updater />
        </Card>
      </div>
    </div>
  );
};

export default App;
