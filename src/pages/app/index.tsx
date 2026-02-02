import { useState, useEffect } from "react";
import { Card, Updater, DragButton, CustomCursor, Button } from "@/components";
import {
  SystemAudio,
  Completion,
  AudioVisualizer,
  StatusIndicator,
} from "./components";
import { useApp } from "@/hooks";
import { useApp as useAppContext } from "@/contexts";
import { SparklesIcon } from "lucide-react";
import { invoke } from "@tauri-apps/api/core";
import { ErrorBoundary } from "react-error-boundary";
import { ErrorLayout } from "@/layouts";
import { getPlatform } from "@/lib";
import { useAdvanceTheme } from "@/hooks/useAdvanceTheme";
import { AdvanceTopBar } from "./components/AdvanceTopBar";
import { TranscriptChatTabs } from "./components/TranscriptChatTabs";
import { safeLocalStorage } from "@/lib";
import { STORAGE_KEYS } from "@/config/constants";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

const App = () => {
  const { isHidden, systemAudio } = useApp();
  const { customizable } = useAppContext();
  const platform = getPlatform();

  // Check if advance theme is enabled
  const [isAdvanceTheme, setIsAdvanceTheme] = useState(false);
  const [transcriptVisible, setTranscriptVisible] = useState(true);

  useEffect(() => {
    const layoutPreference = safeLocalStorage.getItem(STORAGE_KEYS.DASHBOARD_LAYOUT);
    setIsAdvanceTheme(layoutPreference === "advance");
    console.log('[APP] Layout preference:', layoutPreference);
    console.log('[APP] Advance theme enabled:', layoutPreference === "advance");
  }, []);

  // Initialize advance theme hook
  const advanceTheme = useAdvanceTheme();

  const openDashboard = async () => {
    console.log('[APP] ===== DASHBOARD OPEN CLICKED =====');
    console.log('[APP] Calling invoke("open_dashboard")...');
    try {
      await invoke("open_dashboard");
      console.log('[APP] invoke("open_dashboard") completed successfully');
    } catch (error) {
      console.error('[APP ERROR] Failed to open dashboard:', error);
    }
  };

  // Handle Ctrl+Enter keyboard shortcut for advance theme
  useEffect(() => {
    if (!isAdvanceTheme) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.key === 'Enter') {
        event.preventDefault();
        advanceTheme.handleScreenshotAnalysis();
        console.log('[APP] Ctrl+Enter pressed - triggering screenshot analysis');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAdvanceTheme, advanceTheme]);

  return (
    <ErrorBoundary
      fallbackRender={() => {
        return <ErrorLayout isCompact />;
      }}
      resetKeys={["app-error"]}
      onReset={() => {
        console.log("Reset");
      }}
    >
      <div
        className={`w-screen h-screen flex flex-col overflow-hidden ${isHidden ? "hidden pointer-events-none" : ""
          }`}
      >
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

        {/* BOTTOM SECTION: Existing Input + Controls */}
        <div className={isAdvanceTheme && transcriptVisible ? "" : "flex items-center justify-center flex-1"}>
          <Card className="w-full flex flex-row items-center gap-2 p-2">
            <SystemAudio {...systemAudio} />
            {systemAudio?.capturing ? (
              <div className="flex flex-row items-center gap-2 justify-between w-full">
                <div className="flex flex-1 items-center gap-2">
                  <AudioVisualizer
                    stream={systemAudio?.stream}
                    isRecording={systemAudio?.capturing}
                  />
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
              <Completion isHidden={isHidden} />
              <Button
                size={"icon"}
                className="cursor-pointer"
                title="Open Dashboard"
                onClick={openDashboard}
              >
                <SparklesIcon className="h-4 w-4" />
              </Button>
            </div>

            <Updater />
            <DragButton />
          </Card>
        </div>

        {customizable.cursor.type === "invisible" && platform !== "linux" ? (
          <CustomCursor />
        ) : null}
      </div>
    </ErrorBoundary>
  );
};

export default App;
