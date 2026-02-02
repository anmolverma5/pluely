import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Markdown } from '@/components';
import { Loader2, Sparkles, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AIChatPanelProps {
    visible: boolean;
    onToggle?: () => void;
    response: string;
    isProcessing: boolean;
    className?: string;
}

export const AIChatPanel = ({
    visible,
    onToggle,
    response,
    isProcessing,
    className,
}: AIChatPanelProps) => {
    if (!visible) {
        return null;
    }

    return (
        <Card
            className={cn(
                'flex flex-col border-l border-border bg-background/95 backdrop-blur',
                className
            )}
        >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
                <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-purple-500" />
                    <h3 className="text-sm font-semibold">AI Assistant</h3>
                </div>
                {onToggle && (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={onToggle}
                        className="h-8 w-8 p-0"
                    >
                        <X className="h-4 w-4" />
                    </Button>
                )}
            </div>

            {/* Content */}
            <ScrollArea className="flex-1 p-4">
                {isProcessing ? (
                    <div className="flex flex-col items-center justify-center gap-3 py-8">
                        <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
                        <p className="text-sm text-muted-foreground">
                            Analyzing conversation...
                        </p>
                    </div>
                ) : response ? (
                    <div className="prose prose-sm dark:prose-invert max-w-none">
                        <Markdown>{response}</Markdown>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center gap-2 py-8 text-center">
                        <Sparkles className="h-8 w-8 text-muted-foreground/50" />
                        <p className="text-sm text-muted-foreground">
                            Press <kbd className="px-2 py-1 text-xs bg-muted rounded">Ctrl+Enter</kbd> to analyze
                        </p>
                        <p className="text-xs text-muted-foreground/70">
                            AI will analyze the transcript and screenshot
                        </p>
                    </div>
                )}
            </ScrollArea>
        </Card>
    );
};
