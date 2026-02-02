/**
 * Transcript types for Advance Layout theme
 */

export type SpeakerType = 'interviewer' | 'user' | 'system';

export type ListeningStatus = 'idle' | 'listening' | 'paused';

export interface TranscriptMessage {
    id: string;
    speaker: SpeakerType;
    text: string;
    timestamp: number;
    isAI?: boolean;
}

export interface ListeningState {
    status: ListeningStatus;
    startTime?: number;
    pauseTime?: number;
    totalDuration?: number;
}

export interface AIAnalysisRequest {
    transcript: TranscriptMessage[];
    screenshot?: string; // base64 encoded image
    context?: string;
    systemPrompt?: string;
}

export interface AIAnalysisResponse {
    response: string;
    suggestions?: string[];
    error?: string;
}

export interface TranscriptSession {
    id: string;
    messages: TranscriptMessage[];
    startTime: number;
    endTime?: number;
    metadata?: {
        totalMessages: number;
        duration: number;
        aiInteractions: number;
    };
}
