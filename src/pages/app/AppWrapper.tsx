import { safeLocalStorage } from "@/lib";
import { STORAGE_KEYS } from "@/config/constants";
import { AdvanceThemeLayout } from "@/layouts";
import DefaultApp from "./DefaultApp";

/**
 * AppWrapper - Conditionally renders Default or Advance Theme layout
 * based on user's layout preference stored in localStorage
 */
export const AppWrapper = () => {
    // Get layout preference from localStorage
    const layoutPreference = safeLocalStorage.getItem(STORAGE_KEYS.DASHBOARD_LAYOUT);
    const isAdvanceTheme = layoutPreference === "advance";

    console.log('[APP WRAPPER] Layout preference:', layoutPreference);
    console.log('[APP WRAPPER] Using Advance Theme:', isAdvanceTheme);

    // If advance theme is selected, render AdvanceThemeLayout
    if (isAdvanceTheme) {
        return <AdvanceThemeLayout />;
    }

    // Default app layout
    return <DefaultApp />;
};
