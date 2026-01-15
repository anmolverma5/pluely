import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  Header,
  Button,
} from "@/components";
import { MicIcon, RefreshCwIcon, HeadphonesIcon, SettingsIcon, InfoIcon } from "lucide-react";
import { useState, useEffect } from "react";
import { useApp } from "@/contexts";
import { STORAGE_KEYS } from "@/config/constants";
import { safeLocalStorage } from "@/lib/storage";
import { invoke } from "@tauri-apps/api/core";

export const AudioSelection = () => {
  const { selectedAudioDevices, setSelectedAudioDevices } = useApp();

  const [devices, setDevices] = useState<{
    input: MediaDeviceInfo[];
    output: MediaDeviceInfo[];
  }>({
    input: [],
    output: [],
  });
  const [isLoadingDevices, setIsLoadingDevices] = useState(false);
  const [permissionError, setPermissionError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState<{
    input: boolean;
    output: boolean;
  }>({
    input: false,
    output: false,
  });

  // Helper function to restore or set default device
  const restoreOrSetDefaultDevice = (
    type: "input" | "output",
    devices: MediaDeviceInfo[],
    storageKey: string
  ) => {
    const savedDeviceId = safeLocalStorage.getItem(storageKey);
    const shouldRestore =
      savedDeviceId && devices.some((d) => d.deviceId === savedDeviceId);

    if (shouldRestore) {
      setSelectedAudioDevices((prev) => ({ ...prev, [type]: savedDeviceId }));
    } else if (devices.length > 0) {
      const defaultDevice = devices.find((d) => d.deviceId === "default");
      const selectedId = defaultDevice?.deviceId || devices[0].deviceId;

      setSelectedAudioDevices((prev) => ({ ...prev, [type]: selectedId }));
      safeLocalStorage.setItem(storageKey, selectedId);
    }
  };

  // Load all audio devices (input and output)
  const loadAudioDevices = async () => {
    console.log('[AUDIO] Starting to load audio devices...');
    setIsLoadingDevices(true);
    setPermissionError(null);

    try {
      // Request microphone permission first
      console.log('[AUDIO] Requesting microphone permission...');
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });
      console.log('[AUDIO] Permission granted, stopping stream...');

      setTimeout(async () => {
        stream.getTracks().forEach((track) => track.stop());
      }, 2000);

      // Enumerate all audio devices
      console.log('[AUDIO] Enumerating devices...');
      const allDevices = await navigator.mediaDevices.enumerateDevices();
      console.log('[AUDIO] All devices:', allDevices);

      const audioInputs = allDevices.filter(
        (device) => device.kind === "audioinput"
      );
      const audioOutputs = allDevices.filter(
        (device) => device.kind === "audiooutput"
      );

      console.log('[AUDIO] Found inputs:', audioInputs.length, 'outputs:', audioOutputs.length);

      setDevices({ input: audioInputs, output: audioOutputs });

      // Restore or set default devices
      restoreOrSetDefaultDevice(
        "input",
        audioInputs,
        STORAGE_KEYS.SELECTED_AUDIO_INPUT_DEVICE
      );
      restoreOrSetDefaultDevice(
        "output",
        audioOutputs,
        STORAGE_KEYS.SELECTED_AUDIO_OUTPUT_DEVICE
      );

      console.log('[AUDIO] Devices loaded successfully');
    } catch (error: any) {
      console.error('[AUDIO ERROR] Failed to load audio devices:', error);

      // Check if it's a permission error
      if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
        console.error('[AUDIO ERROR] Microphone permission denied by user');
        setPermissionError('Microphone permission denied. Please allow microphone access and click refresh.');
      } else if (error.name === 'NotFoundError') {
        console.error('[AUDIO ERROR] No audio input devices found');
        setPermissionError('No microphone devices found. Please connect a microphone and click refresh.');
      } else {
        console.error('[AUDIO ERROR] Unknown error:', error.message);
        setPermissionError(`Error loading devices: ${error.message}`);
      }
    } finally {
      setIsLoadingDevices(false);
    }
  };

  // Auto-load devices when component mounts
  useEffect(() => {
    console.log('[AUDIO] Component mounted, auto-loading devices...');
    loadAudioDevices();
  }, []);

  // Open Windows microphone settings
  const openWindowsMicrophoneSettings = async () => {
    try {
      // Open Windows microphone privacy settings
      await invoke("open_windows_settings", {
        setting: "ms-settings:privacy-microphone"
      });
    } catch (error) {
      console.error("[AUDIO] Failed to open Windows settings:", error);
      // Fallback: just log the instruction
      alert("Please open Windows Settings → Privacy & Security → Microphone to enable microphone access.");
    }
  };

  // Handle device selection changes
  const handleDeviceChange = (type: "input" | "output", deviceId: string) => {
    setSelectedAudioDevices((prev) => ({
      ...prev,
      [type]: deviceId,
    }));

    const storageKey =
      type === "input"
        ? STORAGE_KEYS.SELECTED_AUDIO_INPUT_DEVICE
        : STORAGE_KEYS.SELECTED_AUDIO_OUTPUT_DEVICE;

    safeLocalStorage.setItem(storageKey, deviceId);

    setShowSuccess((prev) => ({ ...prev, [type]: true }));
    setTimeout(() => {
      setShowSuccess((prev) => ({ ...prev, [type]: false }));
    }, 3000);
  };

  return (
    <div id="audio" className="space-y-1 flex flex-col gap-4">
      {/* Windows Permission Info */}
      <div className="text-xs bg-blue-500/10 border border-blue-500/20 p-4 rounded-md space-y-3">
        <div className="flex items-start gap-2">
          <InfoIcon className="size-4 text-blue-500 mt-0.5 shrink-0" />
          <div className="space-y-2">
            <p className="text-blue-500 font-medium">
              <strong>Windows Microphone Permissions Required</strong>
            </p>
            <p className="text-foreground/70">
              If devices don't appear, Windows may have blocked microphone access.
              Click the button below to open Windows microphone settings.
            </p>
            <div className="flex items-center gap-2 pt-1">
              <Button
                size="sm"
                variant="outline"
                onClick={openWindowsMicrophoneSettings}
                className="text-xs"
              >
                <SettingsIcon className="size-3 mr-1.5" />
                Open Windows Microphone Settings
              </Button>
              <span className="text-muted-foreground text-xs">
                Then click the refresh button below
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Microphone Input Section */}
      <div className="space-y-3">
        <Header
          title="Microphone"
          description="Select your microphone for voice input and speech-to-text. If issues occur, adjust your system's default microphone in OS settings."
        />

        <div className="space-y-3">
          {/* Microphone Selection Dropdown */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Select
                value={selectedAudioDevices.input}
                onValueChange={(value) => handleDeviceChange("input", value)}
                disabled={isLoadingDevices || devices.input.length === 0}
              >
                <SelectTrigger className="w-full h-11 border-1 border-input/50 focus:border-primary/50 transition-colors">
                  <div className="flex items-center gap-2">
                    <MicIcon className="size-4" />
                    <div className="text-sm font-medium truncate">
                      {isLoadingDevices
                        ? "Loading microphones..."
                        : devices.input.length === 0
                          ? "No microphones found"
                          : devices.input.find(
                            (mic) => mic.deviceId === selectedAudioDevices.input
                          )?.label || "Select a microphone"}
                    </div>
                  </div>
                </SelectTrigger>
                <SelectContent>
                  {devices.input.map((mic) => (
                    <SelectItem key={mic.deviceId} value={mic.deviceId}>
                      <div className="flex items-center gap-2">
                        <MicIcon className="size-4" />
                        <div className="font-medium truncate">
                          {mic.label ||
                            `Microphone ${mic.deviceId.slice(0, 8)}`}
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Refresh button */}
              <Button
                size="icon"
                variant="outline"
                onClick={loadAudioDevices}
                disabled={isLoadingDevices}
                className="h-11 w-11 shrink-0"
                title="Refresh microphone list"
              >
                <RefreshCwIcon
                  className={`size-4 ${isLoadingDevices ? "animate-spin" : ""}`}
                />
              </Button>
            </div>
          </div>

          {/* Success message */}
          {showSuccess.input && (
            <div className="text-xs text-green-500 bg-green-500/10 p-3 rounded-md">
              <strong>✓ Microphone changed successfully!</strong>
              <br />
              Using:{" "}
              {devices.input.find(
                (mic) => mic.deviceId === selectedAudioDevices.input
              )?.label || "Unknown device"}
            </div>
          )}

          {/* Permission/Error Notice */}
          {permissionError && (
            <div className="text-xs text-red-500 bg-red-500/10 p-3 rounded-md">
              <strong>❌ {permissionError}</strong>
            </div>
          )}

          {!permissionError && devices.input.length === 0 && !isLoadingDevices && (
            <div className="text-xs text-amber-500 bg-amber-500/10 p-3 rounded-md">
              <strong>
                ⚠️ No microphones detected.
              </strong>{" "}
              Click the refresh button to try again. If this doesn't work, check your system settings.
            </div>
          )}
        </div>

        {/* Tips */}
        <div className="text-xs text-muted-foreground/70">
          <p>
            💡 <strong>Tip:</strong> When you select a microphone, the app will
            immediately switch to that device. You can verify by hovering over
            the microphone button in the main interface - it will show the
            active device name.
          </p>
        </div>
      </div>

      {/* System Audio Output Section */}
      <div className="space-y-3">
        <Header
          title="System Audio"
          description="Select the output device to capture system sounds and application audio. If issues occur, set the correct default output in OS settings."
        />

        <div className="space-y-3">
          {/* Output Selection Dropdown */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Select
                value={selectedAudioDevices.output}
                onValueChange={(value) => handleDeviceChange("output", value)}
                disabled={isLoadingDevices || devices.output.length === 0}
              >
                <SelectTrigger className="w-full h-11 border-1 border-input/50 focus:border-primary/50 transition-colors">
                  <div className="flex items-center gap-2">
                    <HeadphonesIcon className="size-4" />
                    <div className="text-sm font-medium truncate">
                      {isLoadingDevices
                        ? "Loading output devices..."
                        : devices.output.length === 0
                          ? "No output devices found"
                          : devices.output.find(
                            (output) =>
                              output.deviceId === selectedAudioDevices.output
                          )?.label || "Select an output device"}
                    </div>
                  </div>
                </SelectTrigger>
                <SelectContent>
                  {devices.output.map((output) => (
                    <SelectItem key={output.deviceId} value={output.deviceId}>
                      <div className="flex items-center gap-2">
                        <HeadphonesIcon className="size-4" />
                        <div className="font-medium truncate">
                          {output.label}
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Refresh button */}
              <Button
                size="icon"
                variant="outline"
                onClick={loadAudioDevices}
                disabled={isLoadingDevices}
                className="h-11 w-11 shrink-0"
                title="Refresh output device list"
              >
                <RefreshCwIcon
                  className={`size-4 ${isLoadingDevices ? "animate-spin" : ""}`}
                />
              </Button>
            </div>
          </div>

          {/* Success message */}
          {showSuccess.output && (
            <div className="text-xs text-green-500 bg-green-500/10 p-3 rounded-md">
              <strong>✓ Output device changed successfully!</strong>
              <br />
              Using:{" "}
              {devices.output.find(
                (output) => output.deviceId === selectedAudioDevices.output
              )?.label || "Unknown device"}
            </div>
          )}

          {/* Permission/Error Notice */}
          {permissionError && (
            <div className="text-xs text-red-500 bg-red-500/10 p-3 rounded-md">
              <strong>❌ {permissionError}</strong>
            </div>
          )}

          {!permissionError && devices.output.length === 0 && !isLoadingDevices && (
            <div className="text-xs text-amber-500 bg-amber-500/10 p-3 rounded-md">
              <strong>
                ⚠️ No output devices detected.
              </strong>{" "}
              Click the refresh button to try again. If this doesn't work, check your system audio settings.
            </div>
          )}
        </div>

        {/* Tips */}
        <div className="text-xs text-muted-foreground/70">
          <p>
            💡 <strong>Tip:</strong> System audio capture allows you to record
            audio playing through your speakers or headphones. This is useful
            for capturing conversation audio or system sounds along with your
            voice.
          </p>
        </div>
      </div>
    </div>
  );
};
