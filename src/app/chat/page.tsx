'use client';

import { useState, useRef, useEffect } from 'react';
import { API_BASE } from '@/service/baseAPI';

// 타입 정의
interface Message {
  id: number;
  type: 'system' | 'user';
  message: string;
}

interface StockData {
  id: number;
  ticker: string;
  name: string;
  currentPrice: number;
  highPrice1y: number;
  dividendYield: number;
  priceGapRatio: number;
  recommendReason: string;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  detail: string;
}

interface ApiResponse {
  stocks: StockData[];
  Explanation: string;
}

// 초기 데이터
const initialMessages: Message[] = [
  {
    id: 1,
    type: 'system',
    message:
      '안녕하세요! 주식 투자 도우미입니다. 어떤 주식 관련 질문이 있으신가요?',
  },
];

const suggestedQuestions = [
  '고배당 주식 추천해주세요',
  '안전한 투자가 가능한 주식이 있을까요?',
  '현재 저평가된 주식을 알려주세요',
  '배당률 80% 이상인 주식 있나요?',
];

const riskLevelColors = {
  LOW: 'bg-green-500',
  MEDIUM: 'bg-yellow-500',
  HIGH: 'bg-red-500',
};

export default function Page() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [inputValue, setInputValue] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [stockData, setStockData] = useState<ApiResponse | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 메시지 변경 시 항상 최신 위치로 스크롤
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const askForRecommendation = async (
    question: string
  ): Promise<ApiResponse | null> => {
    try {
      setIsLoading(true);
      const response = await fetch(`${API_BASE}/chat/recommend`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question }),
      });

      if (!response.ok) {
        throw new Error('서버 응답 오류');
      }

      const data: ApiResponse = await response.json();
      const botResponse: Message = {
        id: Date.now(),
        type: 'system',
        message: data.Explanation,
      };
      setMessages((prev) => [...prev, botResponse]);
      setStockData(data);
      return data;
    } catch (error) {
      console.error('API 호출 중 오류 발생:', error);
      const errorMessage: Message = {
        id: Date.now(),
        type: 'system',
        message:
          '죄송합니다. 요청을 처리하는 중 오류가 발생했습니다. 다시 시도해 주세요.',
      };
      setMessages((prev) => [...prev, errorMessage]);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!inputValue.trim()) return;
    const userMessage: Message = {
      id: Date.now(),
      type: 'user',
      message: inputValue,
    };
    setMessages((prev) => [...prev, userMessage]);
    const question = inputValue;
    setInputValue('');
    await askForRecommendation(question);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
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
    await askForRecommendation(question);
  };

  const formatNumber = (num: number): string =>
    new Intl.NumberFormat('ko-KR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(num);

  const formatPercent = (num: number): string =>
    new Intl.NumberFormat('ko-KR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(num);

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
          {/* 추천 종목 카드 영역 */}
          <div className="lg:w-1/3">
            <div className="bg-[#1E222D] rounded-lg p-4">
              <h2 className="text-xl font-bold mb-4">추천 종목</h2>
              {!stockData || stockData.stocks.length === 0 ? (
                <div className="bg-[#2A2E39] p-4 rounded-lg text-center">
                  <p className="text-gray-400 mb-2">추천 종목이 없습니다</p>
                  <p className="text-sm text-gray-500">
                    주식에 관한 질문을 해보세요
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4 max-h-[calc(100vh-240px)] overflow-y-auto">
                  {stockData.stocks.map((stock) => (
                    <div
                      key={stock.id}
                      className="bg-[#2A2E39] p-4 rounded-lg hover:shadow-lg transition-all duration-300"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center font-bold">
                            {stock.ticker.charAt(0)}
                          </div>
                          <div>
                            <h3 className="font-medium">{stock.name}</h3>
                            <span className="text-xs text-gray-400">
                              {stock.ticker}
                            </span>
                          </div>
                        </div>
                        <div
                          className={`px-2 py-1 rounded text-xs text-white ${riskLevelColors[stock.riskLevel]}`}
                        >
                          {stock.riskLevel}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mt-3">
                        <div className="bg-[#1E222D] p-2 rounded">
                          <p className="text-xs text-gray-400">현재 가격</p>
                          <p className="font-bold">
                            ${formatNumber(stock.currentPrice)}
                          </p>
                        </div>
                        <div className="bg-[#1E222D] p-2 rounded">
                          <p className="text-xs text-gray-400">1년 최고가</p>
                          <p className="font-bold">
                            ${formatNumber(stock.highPrice1y)}
                          </p>
                        </div>
                        <div className="bg-[#1E222D] p-2 rounded">
                          <p className="text-xs text-gray-400">배당률</p>
                          <p className="font-bold text-green-500">
                            {formatPercent(stock.dividendYield)}%
                          </p>
                        </div>
                        <div className="bg-[#1E222D] p-2 rounded">
                          <p className="text-xs text-gray-400">고점 대비</p>
                          <p className="font-bold text-red-500">
                            -{formatPercent((1 - stock.priceGapRatio) * 100)}%
                          </p>
                        </div>
                      </div>

                      <div className="mt-3">
                        <p className="text-sm text-gray-300">{stock.detail}</p>
                        {stock.recommendReason && (
                          <div className="mt-2 inline-block bg-blue-500 bg-opacity-20 text-white text-xs px-2 py-1 rounded">
                            {stock.recommendReason}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* 챗봇 영역 */}
          <div className="lg:w-2/3">
            <div className="bg-[#1E222D] rounded-lg p-4 flex flex-col h-[calc(100vh-160px)]">
              <h2 className="text-xl font-bold mb-4">주식 AI 어시스턴트</h2>

              {/* 챗봇 메시지 영역 */}
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
                        <p className="text-sm whitespace-pre-wrap">
                          {msg.message}
                        </p>
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

              {/* 추천 질문 영역 */}
              <div className="mb-4">
                <p className="text-sm text-gray-400 mb-2">추천 질문:</p>
                <div className="flex flex-wrap gap-2">
                  {suggestedQuestions.map((question, index) => (
                    <button
                      key={index}
                      onClick={() => handleSuggestedQuestion(question)}
                      disabled={isLoading}
                      className="bg-[#2A2E39] text-sm text-gray-300 px-3 py-1 rounded-full hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {question}
                    </button>
                  ))}
                </div>
              </div>

              {/* 입력 영역 */}
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={inputValue}
                  onChange={handleInputChange}
                  onKeyPress={handleKeyPress}
                  placeholder="주식에 대해 물어보세요..."
                  disabled={isLoading}
                  className="flex-1 bg-[#2A2E39] text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                />
                <button
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className="bg-blue-600 rounded-lg px-4 py-2 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  전송
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
