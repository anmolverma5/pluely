import { Button } from "@/components";
import { Sparkles, MessageSquare, HelpCircle, RotateCcw } from "lucide-react";

interface QuickActionsBarProps {
    onAssist: () => void;
    onWhatToSay: () => void;
    onFollowUp: () => void;
    onRecap: () => void;
}

export const QuickActionsBar = ({
    onAssist,
    onWhatToSay,
    onFollowUp,
    onRecap,
}: QuickActionsBarProps) => {
    return (
        <div className="flex items-center gap-2 border-b border-border bg-background px-4 py-2">
            <Button
                onClick={onAssist}
                variant="ghost"
                size="sm"
                className="text-xs"
            >
                <Sparkles className="mr-1 h-3 w-3" />
                Assist
            </Button>
            <Button
                onClick={onWhatToSay}
                variant="ghost"
                size="sm"
                className="text-xs"
            >
                <MessageSquare className="mr-1 h-3 w-3" />
                What should I say?
            </Button>
            <Button
                onClick={onFollowUp}
                variant="ghost"
                size="sm"
                className="text-xs"
            >
                <HelpCircle className="mr-1 h-3 w-3" />
                Follow-up questions
            </Button>
            <Button
                onClick={onRecap}
                variant="ghost"
                size="sm"
                className="text-xs"
            >
                <RotateCcw className="mr-1 h-3 w-3" />
                Recap
            </Button>
        </div>
    );
};
