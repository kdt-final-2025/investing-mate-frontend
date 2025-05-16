import TradingViewWidget from './ui/TradingViewWidget';

interface Props {
  symbol: string;
}

export default function CompanyChart({ symbol }: Props) {
  return (
    // 부모에서 flex-1 으로 준 높이를 온전히 물려받으려면 h-full
    <div className="w-full h-full">
      <TradingViewWidget symbol={symbol} />
    </div>
  );
}
