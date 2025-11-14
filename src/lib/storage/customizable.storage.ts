import { STORAGE_KEYS } from "@/config";

export type CursorType = "invisible" | "default" | "auto";

export interface CustomizableState {
  appIcon: {
    isVisible: boolean;
  };
  alwaysOnTop: {
    isEnabled: boolean;
  };
  transparency: {
    isEnabled: boolean;
    opacity: number;
  };
  popoverTrigger: {
    isEnabled: boolean;
    opacity: number; // 0..1
  };
  autostart: {
    isEnabled: boolean;
  };
  cursor: {
    type: CursorType;
  };
}

export const DEFAULT_CUSTOMIZABLE_STATE: CustomizableState = {
  appIcon: { isVisible: true },
  alwaysOnTop: { isEnabled: false },
  transparency: { isEnabled: true, opacity: 0.8 },
  popoverTrigger: { isEnabled: true, opacity: 0.25 },
  autostart: { isEnabled: true },
  cursor: { type: "invisible" },
};

/**
 * Get customizable state from localStorage
 */
export const getCustomizableState = (): CustomizableState => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.CUSTOMIZABLE);
    if (!stored) {
      return DEFAULT_CUSTOMIZABLE_STATE;
    }

    const parsedState = JSON.parse(stored);

    // Ensure all required properties exist (for backward compatibility)
    return {
      appIcon: parsedState.appIcon || DEFAULT_CUSTOMIZABLE_STATE.appIcon,
      alwaysOnTop:
        parsedState.alwaysOnTop || DEFAULT_CUSTOMIZABLE_STATE.alwaysOnTop,
      transparency: parsedState.transparency || DEFAULT_CUSTOMIZABLE_STATE.transparency,
      popoverTrigger: parsedState.popoverTrigger || DEFAULT_CUSTOMIZABLE_STATE.popoverTrigger,
      autostart: parsedState.autostart || DEFAULT_CUSTOMIZABLE_STATE.autostart,
      cursor: parsedState.cursor || DEFAULT_CUSTOMIZABLE_STATE.cursor,
    };
  } catch (error) {
    console.error("Failed to get customizable state:", error);
    return DEFAULT_CUSTOMIZABLE_STATE;
  }
};

/**
 * Save customizable state to localStorage
 */
export const setCustomizableState = (state: CustomizableState): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.CUSTOMIZABLE, JSON.stringify(state));
  } catch (error) {
    console.error("Failed to save customizable state:", error);
  }
};

/**
 * Update app icon visibility
 */
export const updateAppIconVisibility = (
  isVisible: boolean
): CustomizableState => {
  const currentState = getCustomizableState();
  const newState = { ...currentState, appIcon: { isVisible } };
  setCustomizableState(newState);
  return newState;
};

/**
 * Update always on top state
 */
export const updateAlwaysOnTop = (isEnabled: boolean): CustomizableState => {
  const currentState = getCustomizableState();
  const newState = { ...currentState, alwaysOnTop: { isEnabled } };
  setCustomizableState(newState);
  return newState;
};

/**
 * Update transparency settings
 */
export const updateTransparency = (
  isEnabled: boolean,
  opacity?: number
): CustomizableState => {
  const currentState = getCustomizableState();
  const newState = {
    ...currentState,
    transparency: {
      isEnabled,
      opacity: opacity ?? currentState.transparency.opacity,
    },
  };
  setCustomizableState(newState);
  return newState;
};

/**
 * Update cursor type
 */
export const updateCursorType = (type: CursorType): CustomizableState => {
  const currentState = getCustomizableState();
  const newState = { ...currentState, cursor: { type } };
  setCustomizableState(newState);
  return newState;
};

/**
 * Update autostart state
 */
export const updateAutostart = (isEnabled: boolean): CustomizableState => {
  const currentState = getCustomizableState();
  const newState = { ...currentState, autostart: { isEnabled } };
  setCustomizableState(newState);
  return newState;
};

/**
 * Update transparency opacity
 */
export const updateTransparencyOpacity = (opacity: number): CustomizableState => {
  const currentState = getCustomizableState();
  const newState = {
    ...currentState,
    transparency: {
      ...currentState.transparency,
      opacity,
    },
  };
  setCustomizableState(newState);
  return newState;
};

/**
 * Update popover trigger transparency settings
 */
export const updatePopoverTrigger = (
  isEnabled: boolean,
  opacity?: number
): CustomizableState => {
  const currentState = getCustomizableState();
  const newState = {
    ...currentState,
    popoverTrigger: {
      isEnabled,
      opacity: opacity ?? currentState.popoverTrigger.opacity,
    },
  };
  setCustomizableState(newState);
  return newState;
};

/**
 * Update popover trigger opacity only
 */
export const updatePopoverTriggerOpacity = (opacity: number): CustomizableState => {
  const currentState = getCustomizableState();
  const newState = {
    ...currentState,
    popoverTrigger: {
      ...currentState.popoverTrigger,
      opacity,
    },
  };
  setCustomizableState(newState);
  return newState;
};

// (button border color feature removed)
