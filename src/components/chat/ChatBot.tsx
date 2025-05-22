'use client';

import React from 'react';
import type { Message } from '@/hooks/useChat';

interface ChatBotProps {
  messages: Message[];
  inputValue: string;
  isLoading: boolean;
  handleInputChangeAction: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleKeyDownAction: (e: React.KeyboardEvent) => void;
  handleSubmitAction: () => Promise<void>;
  handleSuggestedQuestionAction: (question: string) => Promise<void>;
  messagesEndRef: React.RefObject<HTMLDivElement | null>;
}

const suggestedQuestions: string[] = [
  '고배당 주식 추천해주세요',
  '안전한 투자가 가능한 종목 알려주세요',
  '현재 저평가된 주식을 알려주세요',
  '배당률 0.8% 이상인 주식 있나요?',
];

export default function ChatBot({
  messages,
  inputValue,
  isLoading,
  handleInputChangeAction,
  handleKeyDownAction,
  handleSubmitAction,
  handleSuggestedQuestionAction,
  messagesEndRef,
}: ChatBotProps) {
  return (
    <div className="bg-[#1E222D] rounded-lg p-4 flex flex-col h-[calc(100vh-160px)]">
      <h2 className="text-xl font-bold mb-4">주식 AI 어시스턴트</h2>

      <div className="flex-1 overflow-y-auto mb-4">
        <div className="space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-3 ${
                  msg.type === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-[#2A2E39] text-white'
                }`}
              >
                <p className="text-sm whitespace-pre-wrap">{msg.message}</p>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-[#2A2E39] max-w-[80%] rounded-lg p-3">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"></div>
                  <div
                    className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
                    style={{ animationDelay: '0.2s' }}
                  ></div>
                  <div
                    className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
                    style={{ animationDelay: '0.4s' }}
                  ></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="mb-4">
        <p className="text-sm text-gray-400 mb-2">추천 질문:</p>
        <div className="flex flex-wrap gap-2">
          {suggestedQuestions.map((question, index) => (
            <button
              key={index}
              onClick={() => handleSuggestedQuestionAction(question)}
              disabled={isLoading}
              className="bg-[#2A2E39] text-sm text-gray-300 px-3 py-1 rounded-full hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {question}
            </button>
          ))}
        </div>
      </div>

      <div className="flex space-x-2">
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChangeAction}
          onKeyDown={handleKeyDownAction}
          placeholder="주식에 대해 물어보세요..."
          disabled={isLoading}
          className="flex-1 bg-[#2A2E39] text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
        />
        <button
          onClick={handleSubmitAction}
          disabled={isLoading}
          className="bg-blue-600 rounded-lg px-4 py-2 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
        >
          전송
        </button>
      </div>
    </div>
  );
}
