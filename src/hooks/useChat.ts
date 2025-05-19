// src/hooks/useChat.ts
'use client';

import { useState, useRef, useEffect } from 'react';
import { askForRecommendation, ApiResponse } from '@/service/chatService';

export interface Message {
  id: number;
  type: 'system' | 'user';
  message: string;
}

const initialMessages: Message[] = [
  {
    id: 1,
    type: 'system',
    message:
      '안녕하세요! 주식 투자 도우미입니다. 어떤 주식 관련 질문이 있으신가요?',
  },
];

export function useChat() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [inputValue, setInputValue] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [stockData, setStockData] = useState<ApiResponse | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 스크롤 항상 하단으로
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleSubmit = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now(),
      type: 'user',
      message: inputValue,
    };
    setMessages((prev) => [...prev, userMessage]);

    setInputValue('');
    setIsLoading(true);
    try {
      const data = await askForRecommendation(userMessage.message);
      const botMessage: Message = {
        id: Date.now(),
        type: 'system',
        message: data.Explanation,
      };
      setMessages((prev) => [...prev, botMessage]);
      setStockData(data);
    } catch (error) {
      console.error(error);
      const errorMessage: Message = {
        id: Date.now(),
        type: 'system',
        message:
          '죄송합니다. 요청을 처리하는 중 오류가 발생했습니다. 다시 시도해 주세요.',
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleSuggestedQuestion = async (question: string) => {
    const userMessage: Message = {
      id: Date.now(),
      type: 'user',
      message: question,
    };
    setMessages((prev) => [...prev, userMessage]);

    setIsLoading(true);
    try {
      const data = await askForRecommendation(question);
      const botMessage: Message = {
        id: Date.now(),
        type: 'system',
        message: data.Explanation,
      };
      setMessages((prev) => [...prev, botMessage]);
      setStockData(data);
    } catch (error) {
      console.error(error);
      const errorMessage: Message = {
        id: Date.now(),
        type: 'system',
        message:
          '죄송합니다. 요청을 처리하는 중 오류가 발생했습니다. 다시 시도해 주세요.',
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    messages,
    inputValue,
    isLoading,
    stockData,
    handleInputChange,
    handleKeyDown,
    handleSubmit,
    handleSuggestedQuestion,
    messagesEndRef,
  };
}
