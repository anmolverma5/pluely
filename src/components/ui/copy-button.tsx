import { CheckIcon, ClipboardIcon } from "lucide-react";
import { Button } from "./button";
import { useState } from "react";

export const CopyButton = ({ content }: { content: string }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(content);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error("Failed to copy:", err);
        }
    };

    return (
        <Button
            size="icon"
            variant="ghost"
            onClick={handleCopy}
            className="cursor-pointer"
            title={copied ? "Copied!" : "Copy to clipboard"}
        >
            {copied ? (
                <CheckIcon className="h-4 w-4 text-green-500" />
            ) : (
                <ClipboardIcon className="h-4 w-4" />
            )}
        </Button>
    );
};
