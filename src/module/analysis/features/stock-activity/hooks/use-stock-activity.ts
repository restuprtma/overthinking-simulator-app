import { useMemo, useState } from 'react';

import { generateStockActivity } from '../data/mock';

// ----------------------------------------------------------------------

export type StockActivityEngine = ReturnType<typeof useStockActivity>;

export function useStockActivity(initialCode: string, initialDate: string) {
  const [code, setCode] = useState(initialCode);
  const [date, setDate] = useState(initialDate);

  const data = useMemo(() => generateStockActivity(code, date), [code, date]);

  const topBuyers = useMemo(
    () => [...data.brokers].filter((b) => b.netVal > 0).sort((a, b) => b.netVal - a.netVal),
    [data.brokers]
  );
  const topSellers = useMemo(
    () => [...data.brokers].filter((b) => b.netVal < 0).sort((a, b) => a.netVal - b.netVal),
    [data.brokers]
  );
  const topByValue = useMemo(
    () => [...data.brokers].sort((a, b) => b.totalVal - a.totalVal),
    [data.brokers]
  );

  return {
    code,
    date,
    data,
    topBuyers,
    topSellers,
    topByValue,
    setCode,
    setDate,
  };
}
