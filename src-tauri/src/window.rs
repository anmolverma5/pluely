#[cfg(target_os = "macos")]
use tauri::LogicalPosition;
use tauri::{App, AppHandle, Manager, Runtime, WebviewWindow, WebviewWindowBuilder};

// The offset from the top of the screen to the window
const TOP_OFFSET: i32 = 54;

/// Sets up the main window with custom positioning
pub fn setup_main_window(app: &mut App) -> Result<(), Box<dyn std::error::Error>> {
    // Try different possible window labels
    let window = app
        .get_webview_window("main")
        .or_else(|| app.get_webview_window("pluely"))
        .or_else(|| {
            // Get the first window if specific labels don't work
            app.webview_windows().values().next().cloned()
        })
        .ok_or("No window found")?;

    position_window_top_center(&window, TOP_OFFSET)?;

    // Set window as non-focusable on Windows
    // #[cfg(target_os = "windows")]
    // {
    //     let _ = window.set_focusable(false);
    // }

    Ok(())
}

/// Positions a window at the top center of the screen with a specified Y offset
pub fn position_window_top_center<R: Runtime>(
    window: &WebviewWindow<R>,
    y_offset: i32,
) -> Result<(), Box<dyn std::error::Error>> {
    // Get the primary monitor
    if let Some(monitor) = window.primary_monitor()? {
        let monitor_size = monitor.size();
        let window_size = window.outer_size()?;

        // Calculate center X position
        let center_x = (monitor_size.width as i32 - window_size.width as i32) / 2;

        // Set the window position
        window.set_position(tauri::Position::Physical(tauri::PhysicalPosition {
            x: center_x,
            y: y_offset,
        }))?;
    }

    Ok(())
}

/// Future function for centering window completely (both X and Y)
#[allow(dead_code)]
pub fn center_window_completely<R: Runtime>(window: &WebviewWindow<R>) -> Result<(), Box<dyn std::error::Error>> {
    if let Some(monitor) = window.primary_monitor()? {
        let monitor_size = monitor.size();
        let window_size = window.outer_size()?;

        let center_x = (monitor_size.width as i32 - window_size.width as i32) / 2;
        let center_y = (monitor_size.height as i32 - window_size.height as i32) / 2;

        window.set_position(tauri::Position::Physical(tauri::PhysicalPosition {
            x: center_x,
            y: center_y,
        }))?;
    }

    Ok(())
}

#[tauri::command]
pub fn set_window_height(window: tauri::WebviewWindow, height: u32) -> Result<(), String> {
    use tauri::{LogicalSize, Size};

    // Simply set the window size with fixed width and new height
    let new_size = LogicalSize::new(600.0, height as f64);
    window
        .set_size(Size::Logical(new_size))
        .map_err(|e| format!("Failed to resize window: {}", e))?;

    Ok(())
}

#[tauri::command]
pub fn open_dashboard(app: tauri::AppHandle) -> Result<(), String> {
    eprintln!("[RUST] ===== open_dashboard CALLED =====");
    
    // Log all existing windows
    let all_windows: Vec<String> = app.webview_windows().keys().map(|k| k.to_string()).collect();
    eprintln!("[RUST] All existing windows: {:?}", all_windows);
    eprintln!("[RUST] Total window count: {}", all_windows.len());
    
    // Check if dashboard window already exists
    let dashboard_exists = app.get_webview_window("dashboard");
    eprintln!("[RUST] Dashboard window exists: {}", dashboard_exists.is_some());
    
    if let Some(dashboard_window) = dashboard_exists {
        eprintln!("[RUST] Dashboard window found - reusing existing window");
        
        // Check if window is visible
        match dashboard_window.is_visible() {
            Ok(visible) => eprintln!("[RUST] Window is_visible: {}", visible),
            Err(e) => eprintln!("[RUST] Failed to check visibility: {}", e),
        }
        
        // Check if window is minimized/closed
        match dashboard_window.is_closable() {
            Ok(closable) => eprintln!("[RUST] Window is_closable: {}", closable),
            Err(e) => eprintln!("[RUST] Failed to check closable: {}", e),
        }
        
        eprintln!("[RUST] Setting focus...");
        dashboard_window
            .set_focus()
            .map_err(|e| format!("Failed to focus dashboard window: {}", e))?;
        eprintln!("[RUST] Focus set successfully");
        
        eprintln!("[RUST] Showing window...");
        dashboard_window
            .show()
            .map_err(|e| format!("Failed to show dashboard window: {}", e))?;
        eprintln!("[RUST] Window shown successfully");
    } else {
        eprintln!("[RUST] Dashboard window doesn't exist, creating new window...");
        eprintln!("[RUST] WARNING: Window was created at startup but now missing!");
        eprintln!("[RUST] This might cause the second build to hang!");
        
        create_dashboard_window(&app)
            .map_err(|e| format!("Failed to create dashboard window: {}", e))?;
        eprintln!("[RUST] Dashboard window created successfully");
    }

    eprintln!("[RUST] open_dashboard completed");
    Ok(())
}

#[tauri::command]
pub fn toggle_dashboard(app: tauri::AppHandle) -> Result<(), String> {
    if let Some(dashboard_window) = app.get_webview_window("dashboard") {
        match dashboard_window.is_visible() {
            Ok(true) => {
                // Window is visible, hide it
                dashboard_window
                    .hide()
                    .map_err(|e| format!("Failed to hide dashboard window: {}", e))?;
            }
            Ok(false) => {
                // Window is hidden, show and focus it
                dashboard_window
                    .show()
                    .map_err(|e| format!("Failed to show dashboard window: {}", e))?;
                dashboard_window
                    .set_focus()
                    .map_err(|e| format!("Failed to focus dashboard window: {}", e))?;
            }
            Err(e) => {
                return Err(format!("Failed to check dashboard visibility: {}", e));
            }
        }
    } else {
        // Window doesn't exist, create it
        create_dashboard_window(&app)
            .map_err(|e| format!("Failed to create dashboard window: {}", e))?;
    }

    Ok(())
}

#[tauri::command]
pub fn move_window(app: tauri::AppHandle, direction: String, step: i32) -> Result<(), String> {
    if let Some(window) = app.get_webview_window("main") {
        let current_pos = window
            .outer_position()
            .map_err(|e| format!("Failed to get window position: {}", e))?;

        let (new_x, new_y) = match direction.as_str() {
            "up" => (current_pos.x, current_pos.y - step),
            "down" => (current_pos.x, current_pos.y + step),
            "left" => (current_pos.x - step, current_pos.y),
            "right" => (current_pos.x + step, current_pos.y),
            _ => return Err(format!("Invalid direction: {}", direction)),
        };

        window
            .set_position(tauri::Position::Physical(tauri::PhysicalPosition {
                x: new_x,
                y: new_y,
            }))
            .map_err(|e| format!("Failed to set window position: {}", e))?;
    } else {
        return Err("Main window not found".to_string());
    }

    Ok(())
}

#[tauri::command]
pub fn reset_window_position<R: Runtime>(app: AppHandle<R>) -> Result<(), String> {
    if let Some(window) = app.get_webview_window("main") {
        // First, make sure the window is visible and focused
        window
            .show()
            .map_err(|e| format!("Failed to show window: {}", e))?;
        
        window
            .set_focus()
            .map_err(|e| format!("Failed to focus window: {}", e))?;

        // Position the window at top center of the screen
        position_window_top_center(&window, TOP_OFFSET)
            .map_err(|e| format!("Failed to position window: {}", e))?;
    } else {
        return Err("Main window not found".to_string());
    }

    Ok(())
}

pub fn create_dashboard_window<R: Runtime>(
    app: &AppHandle<R>,
) -> Result<WebviewWindow<R>, tauri::Error> {
    eprintln!("[RUST] create_dashboard_window - Starting...");
    eprintln!("[RUST] Creating window with URL: /dashboard");
    
    let base_builder =
        WebviewWindowBuilder::new(app, "dashboard", tauri::WebviewUrl::App("/dashboard".into()));

    #[cfg(target_os = "macos")]
    let base_builder = base_builder
        .title("Pluely - Dashboard")
        .center()
        .decorations(true)
        .inner_size(1200.0, 800.0)
        .min_inner_size(800.0, 600.0)
        .hidden_title(true)
        .title_bar_style(tauri::TitleBarStyle::Overlay)
        .content_protected(true)
        .visible(true)
        .traffic_light_position(LogicalPosition::new(14.0, 18.0));

    #[cfg(not(target_os = "macos"))]
    let base_builder = base_builder
        .title("Pluely - Dashboard")
        .center()
        .decorations(true)
        .inner_size(800.0, 600.0)
        .min_inner_size(800.0, 600.0)
        .content_protected(true)
        .visible(true);

    eprintln!("[RUST] Building window...");
    let window = base_builder.build()?;
    
    eprintln!("[RUST] Window built successfully");
    
    // Clone window for the closure
    let window_clone = window.clone();
    
    // Intercept close event to hide window instead of destroying it
    window.on_window_event(move |event| {
        match event {
            tauri::WindowEvent::CloseRequested { api, .. } => {
                eprintln!("[RUST WINDOW EVENT] Dashboard close requested - hiding instead of closing");
                // Prevent the window from being destroyed
                api.prevent_close();
                // Hide the window instead
                let _ = window_clone.hide();
                eprintln!("[RUST WINDOW EVENT] Dashboard window hidden");
            }
            tauri::WindowEvent::Destroyed => {
                eprintln!("[RUST WINDOW EVENT] Dashboard window destroyed!");
            }
            tauri::WindowEvent::Focused(focused) => {
                eprintln!("[RUST WINDOW EVENT] Dashboard focus changed: {}", focused);
            }
            _ => {}
        }
    });
    
    eprintln!("[RUST] Window event listeners attached (close = hide)");
    
    Ok(window)
}
