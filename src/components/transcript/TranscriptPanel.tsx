import { useEffect, useRef } from 'react';
import { TranscriptMessage } from '@/types/transcript.types';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

interface TranscriptPanelProps {
    messages: TranscriptMessage[];
    className?: string;
}

export const TranscriptPanel = ({ messages, className }: TranscriptPanelProps) => {
    const scrollRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to bottom when new messages arrive
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    if (messages.length === 0) {
        return (
            <div className={cn('flex h-full items-center justify-center', className)}>
                <div className="text-center text-muted-foreground">
                    <p className="text-sm">No transcript yet</p>
                    <p className="text-xs mt-1">Click "Start Listening" to begin</p>
                </div>
            </div>
        );
    }

    return (
        <ScrollArea className={cn('h-full w-full', className)}>
            <div ref={scrollRef} className="flex flex-col gap-3 p-4">
                {messages.map((message) => (
                    <TranscriptMessageBubble key={message.id} message={message} />
                ))}
            </div>
        </ScrollArea>
    );
};

interface TranscriptMessageBubbleProps {
    message: TranscriptMessage;
}

const TranscriptMessageBubble = ({ message }: TranscriptMessageBubbleProps) => {
    const isInterviewer = message.speaker === 'interviewer';
    const isSystem = message.speaker === 'system' || message.isAI;
    const time = new Date(message.timestamp).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
    });

    return (
        <div
            className={cn(
                'flex flex-col gap-1',
                isInterviewer ? 'items-start' : 'items-end'
            )}
        >
            {/* Speaker label */}
            <div className="flex items-center gap-2 px-1">
                <span className="text-xs font-medium text-muted-foreground">
                    {isSystem ? 'AI Assistant' : isInterviewer ? 'Interviewer' : 'You'}
                </span>
                <span className="text-xs text-muted-foreground">{time}</span>
            </div>

            {/* Message bubble */}
            <div
                className={cn(
                    'max-w-[80%] rounded-2xl px-4 py-2 shadow-sm',
                    isSystem
                        ? 'bg-purple-500/10 border border-purple-500/20 text-purple-900 dark:text-purple-100'
                        : isInterviewer
                            ? 'bg-muted text-foreground'
                            : 'bg-primary text-primary-foreground'
                )}
            >
                <p className="text-sm whitespace-pre-wrap break-words">{message.text}</p>
            </div>
        </div>
    );
};
