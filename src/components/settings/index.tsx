import { useSettings } from "@/hooks";
import { SettingsIcon } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
  Button,
  ScrollArea,
} from "@/components";
import { AppIconToggle } from "@/pages/settings/components/AppIconToggle";
import { AlwaysOnTopToggle } from "@/pages/settings/components/AlwaysOnTopToggle";
import { DeleteChats } from "@/pages/settings/components/DeleteChats";
import { ResetPosition } from "@/pages/settings/components/ResetPosition";
import { TransparencyToggle } from "@/pages/dev/components/TransparencyToggle";
import { AIProviders } from "@/pages/dev/components/ai-configs";
import { STTProviders } from "@/pages/dev/components/stt-configs";
import { ScreenshotConfigs } from "@/pages/screenshot/components/ScreenshotConfigs";
import { PluelyApiSetup } from "@/pages/dashboard/components/PluelyApiSetup";
import SystemPrompt from "@/pages/system-prompts";
import Disclaimer from "@/pages/responses";

export const Settings = () => {
  const settings = useSettings();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          size="icon"
          aria-label="Open Settings"
          className="cursor-pointer [data-state=open]:bg-[red]"
          title="Open Settings"
        >
          <SettingsIcon className="h-4 w-4" />
        </Button>
      </PopoverTrigger>

      {/* Settings Panel */}
      <PopoverContent
        align="end"
        side="bottom"
        className="select-none w-screen p-0 border overflow-hidden border-input/50"
        sideOffset={8}
      >
        <ScrollArea className="h-[calc(100vh-7.2rem)]">
          <div className="p-6 space-y-6">
            {/* Pluely API Setup */}
            <PluelyApiSetup />

            {/* System Prompt */}
            <SystemPrompt />

            {/* Screenshot Configs */}
            <ScreenshotConfigs {...settings} />

            {/* App Icon Toggle */}
            <AppIconToggle />

            {/* Always On Top Toggle */}
            <AlwaysOnTopToggle />

            {/* Reset Window Position */}
            <ResetPosition />

            {/* Transparency Toggle */}
            <TransparencyToggle />

            {/* (Button Color Toggle removed) */}

            {/* Provider Selection */}
            <AIProviders {...settings} />

            {/* STT Providers */}
            <STTProviders {...settings} />

            {/* Disclaimer */}
            <DeleteChats {...settings} />
          </div>

          <div className="pt-2 pb-6 flex items-center justify-center">
            <a
              href="https://www.srikanthnani.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-muted-foreground text-center font-medium"
            >
              🚀 Built by Srikanth Nani ✨
            </a>
          </div>
        </ScrollArea>

        <div className="border-t border-input/50">
          <Disclaimer />
        </div>
      </PopoverContent>
    </Popover>
  );
};
