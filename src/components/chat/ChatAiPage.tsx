'use client';

import React from 'react';
import StockList from '@/components/chat/StockList';
import ChatBot from '@/components/chat/ChatBot';
import { useChat } from '@/hooks/useChat';

export default function ChatAiPage() {
  const {
    messages,
    inputValue,
    isLoading,
    stockData,
    handleInputChange: handleInputChangeAction,
    handleKeyDown: handleKeyDownAction,
    handleSubmit: handleSubmitAction,
    handleSuggestedQuestion: handleSuggestedQuestionAction,
    messagesEndRef,
  } = useChat();

  return (
    <main className="min-h-screen bg-[#131722] text-white">
      <div className="container mx-auto p-4">
        {/* 상단 네비게이션 */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl md:text-3xl font-bold flex items-center">
            <span className="text-red-600">Stock</span>
            <span>AI</span>
          </h1>
          <div className="flex items-center space-x-2">
            <span className="text-gray-400">
              {new Date().toLocaleDateString()}
            </span>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          <div className="lg:w-1/3">
            <StockList stockData={stockData} />
          </div>
          <div className="lg:w-2/3">
            <ChatBot
              messages={messages}
              inputValue={inputValue}
              isLoading={isLoading}
              handleInputChangeAction={handleInputChangeAction}
              handleKeyDownAction={handleKeyDownAction}
              handleSubmitAction={handleSubmitAction}
              handleSuggestedQuestionAction={handleSuggestedQuestionAction}
              messagesEndRef={messagesEndRef}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
