import { useState, useCallback, useEffect, useRef } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { listen } from '@tauri-apps/api/event';
import { ListeningState, AIAnalysisRequest, AIAnalysisResponse } from '@/types/transcript.types';
import { useTranscript } from './useTranscript';

/**
 * Main hook for Advance Layout theme functionality
 * Manages listening state, audio capture, screenshot analysis, and AI integration
 */
export const useAdvanceTheme = () => {
    const { addMessage, messages, clearTranscript, copyTranscript, getTranscriptText } = useTranscript();

    const [listeningState, setListeningState] = useState<ListeningState>({
        status: 'idle',
    });

    const [aiChatVisible, setAiChatVisible] = useState(true);
    const [aiResponse, setAiResponse] = useState<string>('');
    const [isAIProcessing, setIsAIProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const audioStreamRef = useRef<MediaStream | null>(null);
    const recognitionRef = useRef<any>(null);

    // Initialize speech recognition
    useEffect(() => {
        if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
            const SpeechRecognition = (window as any).webkitSpeechRecognition;
            const recognition = new SpeechRecognition();

            recognition.continuous = true;
            recognition.interimResults = true;
            recognition.lang = 'en-US';

            recognition.onresult = (event: any) => {
                const transcript = Array.from(event.results)
                    .map((result: any) => result[0])
                    .map((result: any) => result.transcript)
                    .join('');

                if (event.results[event.results.length - 1].isFinal) {
                    // Add final transcript as interviewer message
                    addMessage(transcript, 'interviewer', false);
                }
            };

            recognition.onerror = (event: any) => {
                console.error('Speech recognition error:', event.error);
                setError(`Speech recognition error: ${event.error}`);
            };

            recognitionRef.current = recognition;
        }

        return () => {
            if (recognitionRef.current) {
                recognitionRef.current.stop();
            }
        };
    }, [addMessage]);

    // Listen for Ctrl+Enter shortcut event from backend
    useEffect(() => {
        const unlisten = listen('advance-theme-screenshot-analyze', async () => {
            await handleScreenshotAnalysis();
        });

        return () => {
            unlisten.then((fn) => fn());
        };
    }, [messages]);

    const startListening = useCallback(async () => {
        try {
            setError(null);

            // Request microphone access
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            audioStreamRef.current = stream;

            // Start speech recognition
            if (recognitionRef.current) {
                recognitionRef.current.start();
            }

            setListeningState({
                status: 'listening',
                startTime: Date.now(),
            });

            console.log('Started listening...');
        } catch (err) {
            console.error('Failed to start listening:', err);
            setError('Failed to access microphone. Please check permissions.');
        }
    }, []);

    const pauseListening = useCallback(() => {
        if (recognitionRef.current && listeningState.status === 'listening') {
            recognitionRef.current.stop();

            setListeningState((prev) => ({
                ...prev,
                status: 'paused',
                pauseTime: Date.now(),
            }));
        }
    }, [listeningState.status]);

    const resumeListening = useCallback(() => {
        if (recognitionRef.current && listeningState.status === 'paused') {
            recognitionRef.current.start();

            setListeningState((prev) => ({
                ...prev,
                status: 'listening',
                pauseTime: undefined,
            }));
        }
    }, [listeningState.status]);

    const stopListening = useCallback(() => {
        if (recognitionRef.current) {
            recognitionRef.current.stop();
        }

        if (audioStreamRef.current) {
            audioStreamRef.current.getTracks().forEach((track) => track.stop());
            audioStreamRef.current = null;
        }

        setListeningState({
            status: 'idle',
        });

        console.log('Stopped listening');
    }, []);

    const handleScreenshotAnalysis = useCallback(async () => {
        try {
            setIsAIProcessing(true);
            setError(null);

            // Capture screenshot using Tauri backend
            const screenshotResult: any = await invoke('capture_screenshot', {
                captureMode: 'auto',
            });

            if (!screenshotResult || !screenshotResult.success) {
                throw new Error('Failed to capture screenshot');
            }

            // Prepare AI analysis request
            const analysisRequest: AIAnalysisRequest = {
                transcript: messages,
                screenshot: screenshotResult.image_base64,
                context: 'Analyze the conversation transcript and screenshot to provide helpful suggestions or answers.',
            };

            // Call AI API (using existing completion API)
            const aiResult = await analyzeWithAI(analysisRequest);

            if (aiResult.response) {
                setAiResponse(aiResult.response);
                addMessage(aiResult.response, 'system', true);
            }

        } catch (err) {
            console.error('Screenshot analysis failed:', err);
            setError('Failed to analyze screenshot. Please try again.');
        } finally {
            setIsAIProcessing(false);
        }
    }, [messages, addMessage]);

    const analyzeWithAI = async (request: AIAnalysisRequest): Promise<AIAnalysisResponse> => {
        try {
            // Build context from transcript
            const transcriptContext = request.transcript
                .map((msg) => `${msg.speaker}: ${msg.text}`)
                .join('\n');

            // Use existing AI completion API
            const response: any = await invoke('get_completion', {
                messages: [
                    {
                        role: 'system',
                        content: request.context || 'You are a helpful AI assistant analyzing a conversation.',
                    },
                    {
                        role: 'user',
                        content: `Here is the conversation transcript:\n\n${transcriptContext}\n\nPlease provide helpful suggestions or answers based on this conversation.`,
                    },
                ],
                includeScreenshot: !!request.screenshot,
                screenshotBase64: request.screenshot,
            });

            return {
                response: response.content || response.message || 'No response from AI',
            };
        } catch (error) {
            console.error('AI analysis error:', error);
            return {
                response: '',
                error: 'Failed to get AI response',
            };
        }
    };

    const toggleAiChat = useCallback(() => {
        setAiChatVisible((prev) => !prev);
    }, []);

    return {
        // Listening state
        listeningState,
        startListening,
        pauseListening,
        resumeListening,
        stopListening,

        // Transcript
        messages,
        clearTranscript,
        copyTranscript,
        getTranscriptText,

        // AI Chat
        aiChatVisible,
        toggleAiChat,
        aiResponse,
        isAIProcessing,

        // Screenshot analysis
        handleScreenshotAnalysis,

        // Error state
        error,
    };
};
