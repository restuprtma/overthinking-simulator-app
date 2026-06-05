import { useMemo, useState } from 'react';

import { generateBrokerActivity } from '../data/mock';

// ----------------------------------------------------------------------

export type BrokerActivityEngine = ReturnType<typeof useBrokerActivity>;

export function useBrokerActivity(initialCode: string, initialDate: string) {
  const [code, setCode] = useState(initialCode);
  const [date, setDate] = useState(initialDate);

  const data = useMemo(() => generateBrokerActivity(code, date), [code, date]);

  const topBought = useMemo(
    () => [...data.stocks].filter((s) => s.netVal > 0).sort((a, b) => b.netVal - a.netVal),
    [data.stocks]
  );
  const topSold = useMemo(
    () => [...data.stocks].filter((s) => s.netVal < 0).sort((a, b) => a.netVal - b.netVal),
    [data.stocks]
  );
  const topByValue = useMemo(
    () => [...data.stocks].sort((a, b) => b.totalVal - a.totalVal),
    [data.stocks]
  );

  return {
    code,
    date,
    data,
    topBought,
    topSold,
    topByValue,
    setCode,
    setDate,
  };
}
