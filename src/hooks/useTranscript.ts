import { useState, useCallback, useEffect } from 'react';
import { TranscriptMessage, SpeakerType } from '@/types/transcript.types';
import { safeLocalStorage } from '@/lib';
import { STORAGE_KEYS } from '@/config/constants';

/**
 * Hook for managing transcript messages in Advance Layout theme
 */
export const useTranscript = () => {
    const [messages, setMessages] = useState<TranscriptMessage[]>([]);

    // Load transcript from localStorage on mount
    useEffect(() => {
        const savedTranscript = safeLocalStorage.getItem(STORAGE_KEYS.ADVANCE_THEME_TRANSCRIPT);
        if (savedTranscript) {
            try {
                const parsed = JSON.parse(savedTranscript);
                if (Array.isArray(parsed)) {
                    setMessages(parsed);
                }
            } catch (error) {
                console.error('Failed to load transcript from localStorage:', error);
            }
        }
    }, []);

    // Save transcript to localStorage whenever it changes
    useEffect(() => {
        if (messages.length > 0) {
            safeLocalStorage.setItem(STORAGE_KEYS.ADVANCE_THEME_TRANSCRIPT, JSON.stringify(messages));
        }
    }, [messages]);

    const addMessage = useCallback((text: string, speaker: SpeakerType, isAI: boolean = false) => {
        const newMessage: TranscriptMessage = {
            id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            speaker,
            text,
            timestamp: Date.now(),
            isAI,
        };

        setMessages((prev) => [...prev, newMessage]);
        return newMessage;
    }, []);

    const clearTranscript = useCallback(() => {
        setMessages([]);
        safeLocalStorage.removeItem(STORAGE_KEYS.ADVANCE_THEME_TRANSCRIPT);
    }, []);

    const copyTranscript = useCallback(() => {
        const transcriptText = messages
            .map((msg) => {
                const time = new Date(msg.timestamp).toLocaleTimeString();
                const speaker = msg.speaker === 'interviewer' ? 'Interviewer' : 'You';
                return `[${time}] ${speaker}: ${msg.text}`;
            })
            .join('\n');

        navigator.clipboard.writeText(transcriptText).then(
            () => {
                console.log('Transcript copied to clipboard');
            },
            (err) => {
                console.error('Failed to copy transcript:', err);
            }
        );

        return transcriptText;
    }, [messages]);

    const getTranscriptText = useCallback(() => {
        return messages.map((msg) => msg.text).join(' ');
    }, [messages]);

    return {
        messages,
        addMessage,
        clearTranscript,
        copyTranscript,
        getTranscriptText,
    };
};
