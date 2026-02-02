import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Copy, Sparkles, MessageSquare, HelpCircle, RotateCcw } from 'lucide-react';
import { TranscriptPanel } from '@/components/transcript/TranscriptPanel';
import { AIChatPanel } from '@/components/transcript/AIChatPanel';
import { TranscriptMessage } from '@/types/transcript.types';
import { cn } from '@/lib/utils';

interface TranscriptChatTabsProps {
    messages: TranscriptMessage[];
    aiResponse: string;
    isAIProcessing: boolean;
    onCopyTranscript: () => void;
    className?: string;
}

export const TranscriptChatTabs = ({
    messages,
    aiResponse,
    isAIProcessing,
    onCopyTranscript,
    className,
}: TranscriptChatTabsProps) => {
    const [activeTab, setActiveTab] = useState<'chat' | 'transcript'>('chat');

    return (
        <div className={cn('flex flex-col h-full', className)}>
            <Tabs
                value={activeTab}
                onValueChange={(value) => setActiveTab(value as 'chat' | 'transcript')}
                className="flex flex-col h-full"
            >
                {/* Tab Headers */}
                <div className="flex items-center justify-between px-4 pt-3 border-b border-border">
                    <div className="flex items-center gap-4">
                        <TabsList className="bg-transparent p-0 h-auto">
                            <TabsTrigger
                                value="chat"
                                className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none bg-transparent px-4 py-2"
                            >
                                Chat
                            </TabsTrigger>
                            <TabsTrigger
                                value="transcript"
                                className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none bg-transparent px-4 py-2"
                            >
                                Transcript
                            </TabsTrigger>
                        </TabsList>

                        {/* Quick Actions (visible on transcript tab) */}
                        {activeTab === 'transcript' && messages.length > 0 && (
                            <Button
                                onClick={onCopyTranscript}
                                variant="outline"
                                size="sm"
                                className="gap-2"
                            >
                                <Copy className="h-3 w-3" />
                                Copy All
                            </Button>
                        )}
                    </div>

                    {/* Quick Action Buttons (visible on chat tab) */}
                    {activeTab === 'chat' && (
                        <div className="flex items-center gap-2">
                            <Button variant="ghost" size="sm" className="gap-1 text-xs">
                                <Sparkles className="h-3 w-3" />
                                Assist
                            </Button>
                            <Button variant="ghost" size="sm" className="gap-1 text-xs">
                                <MessageSquare className="h-3 w-3" />
                                What should I say?
                            </Button>
                            <Button variant="ghost" size="sm" className="gap-1 text-xs">
                                <HelpCircle className="h-3 w-3" />
                                Follow-up questions
                            </Button>
                            <Button variant="ghost" size="sm" className="gap-1 text-xs">
                                <RotateCcw className="h-3 w-3" />
                                Recap
                            </Button>
                        </div>
                    )}
                </div>

                {/* Tab Content */}
                <TabsContent value="chat" className="flex-1 mt-0 overflow-hidden">
                    <AIChatPanel
                        visible={true}
                        onToggle={() => { }}
                        response={aiResponse}
                        isProcessing={isAIProcessing}
                        className="h-full border-0"
                    />
                </TabsContent>

                <TabsContent value="transcript" className="flex-1 mt-0 overflow-hidden">
                    <TranscriptPanel messages={messages} className="h-full" />
                </TabsContent>
            </Tabs>
        </div>
    );
};
