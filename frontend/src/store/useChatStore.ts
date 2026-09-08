import { create } from 'zustand';

interface Message {
  id: string;
  sender: 'user' | 'ai';
  content: string;
}

interface ChatState {
  sessionId: number | null;
  pet: any | null;
  messages: Message[];
  isTyping: boolean;
  setSessionId: (id: number) => void;
  setPet: (pet: any) => void;
  addMessage: (message: Message) => void;
  setIsTyping: (typing: boolean) => void;
  resetChat: () => void;
}

export const useChatStore = create<ChatState>((set) => ({
  sessionId: null,
  pet: null,
  messages: [],
  isTyping: false,
  setSessionId: (id) => set({ sessionId: id }),
  setPet: (pet) => set({ pet }),
  addMessage: (message) => set((state) => ({ messages: [...state.messages, message] })),
  setIsTyping: (isTyping) => set({ isTyping }),
  resetChat: () => set({ sessionId: null, pet: null, messages: [], isTyping: false }),
}));
