import { useState, useEffect, useRef } from "react";
import { Button } from "@/components";
import { Copy, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { invoke } from "@tauri-apps/api/core";

interface Message {
    id: string;
    type: "user" | "interviewer" | "ai";
    content: string;
    timestamp: Date;
}

interface TranscriptViewProps {
    messages: Message[];
    activeTab: "chat" | "transcript";
    onTabChange: (tab: "chat" | "transcript") => void;
    isAnalyzing?: boolean;
}

export const TranscriptView = ({
    messages,
    activeTab,
    onTabChange,
    isAnalyzing = false,
}: TranscriptViewProps) => {
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [isCopying, setIsCopying] = useState(false);

    // Auto-scroll to bottom when new messages arrive
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // Handle Ctrl+Enter for screenshot and AI analysis
    useEffect(() => {
        const handleKeyDown = async (e: KeyboardEvent) => {
            if (e.ctrlKey && e.key === "Enter" && activeTab === "transcript") {
                e.preventDefault();
                await handleAnalyzeTranscript();
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [activeTab, messages]);

    const handleAnalyzeTranscript = async () => {
        try {
            // Take screenshot
            await invoke("take_screenshot");

            // Collect transcript
            const transcript = messages
                .map((m) => `${m.type}: ${m.content}`)
                .join("\n");

            // TODO: Send to AI for analysis
            console.log("Analyzing transcript:", transcript);
        } catch (error) {
            console.error("Failed to analyze transcript:", error);
        }
    };

    const handleCopyAll = async () => {
        setIsCopying(true);
        try {
            const transcript = messages
                .map((m) => `${m.type}: ${m.content}`)
                .join("\n");
            await navigator.clipboard.writeText(transcript);
            setTimeout(() => setIsCopying(false), 2000);
        } catch (error) {
            console.error("Failed to copy:", error);
            setIsCopying(false);
        }
    };

    return (
        <div className="flex h-full flex-col">
            {/* Tabs */}
            <div className="flex items-center justify-between border-b border-border bg-background px-4">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => onTabChange("chat")}
                        className={cn(
                            "border-b-2 px-4 py-2 text-sm font-medium transition-colors",
                            activeTab === "chat"
                                ? "border-blue-600 text-blue-600"
                                : "border-transparent text-muted-foreground hover:text-foreground"
                        )}
                    >
                        Chat
                    </button>
                    <button
                        onClick={() => onTabChange("transcript")}
                        className={cn(
                            "border-b-2 px-4 py-2 text-sm font-medium transition-colors",
                            activeTab === "transcript"
                                ? "border-blue-600 text-blue-600"
                                : "border-transparent text-muted-foreground hover:text-foreground"
                        )}
                    >
                        Transcript
                    </button>
                </div>

                {activeTab === "transcript" && (
                    <Button
                        onClick={handleCopyAll}
                        variant="outline"
                        size="sm"
                        disabled={isCopying || messages.length === 0}
                    >
                        <Copy className="mr-2 h-3 w-3" />
                        {isCopying ? "Copied!" : "Copy All"}
                    </Button>
                )}
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.length === 0 ? (
                    <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                        {activeTab === "transcript"
                            ? "Start listening to see transcript..."
                            : "No messages yet..."}
                    </div>
                ) : (
                    messages.map((message) => (
                        <div
                            key={message.id}
                            className={cn(
                                "flex",
                                message.type === "user" ? "justify-end" : "justify-start"
                            )}
                        >
                            <div
                                className={cn(
                                    "max-w-[80%] rounded-lg px-4 py-2",
                                    message.type === "user"
                                        ? "bg-blue-600 text-white"
                                        : message.type === "ai"
                                            ? "bg-green-600 text-white"
                                            : "bg-muted text-foreground"
                                )}
                            >
                                <div className="text-xs font-medium mb-1 opacity-70">
                                    {message.type === "user"
                                        ? "You"
                                        : message.type === "ai"
                                            ? "AI Assistant"
                                            : "Interviewer"}
                                </div>
                                <div className="text-sm">{message.content}</div>
                            </div>
                        </div>
                    ))
                )}

                {isAnalyzing && (
                    <div className="flex justify-center">
                        <div className="flex items-center gap-2 rounded-lg bg-muted px-4 py-2 text-sm">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Analyzing transcript...
                        </div>
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            {/* Ctrl+Enter hint */}
            {activeTab === "transcript" && messages.length > 0 && (
                <div className="border-t border-border bg-muted/50 px-4 py-2 text-xs text-muted-foreground">
                    Press <kbd className="rounded bg-background px-1.5 py-0.5">Ctrl</kbd> +{" "}
                    <kbd className="rounded bg-background px-1.5 py-0.5">Enter</kbd> to
                    analyze transcript with screenshot
                </div>
            )}
        </div>
    );
};
