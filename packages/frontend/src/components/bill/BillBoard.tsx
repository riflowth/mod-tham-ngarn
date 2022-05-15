import fetch from '@utils/Fetch';
import { useEffect, useState } from 'react';

type Bill = {
  billId: number;
  storeName: string;
  orderDate: Date;
  orderBy: number;
}

type ApiResponse<T> = {
  data: T,
};

type BillBoardProps = {
  billId: number,
};

export const BillBoard = ({
  billId,
}: BillBoardProps) => {
  const [bill, setBill] = useState<Bill>();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch.get<ApiResponse<Bill>>(`/bill/${billId}`);
        setBill(response.data.data);
      } catch (e) {
        // TODO
        return {};
      }
    };
    fetchData();
  }, [billId]);

  if (!bill) {
    return <div> </div>;
  }

  return (
    <div className="w-full overflow-y-auto mb-4">
      <div className="flex flex-row items-center mb-4">
        <h1 className="text-white font-semibold text-lg mr-2">Bill</h1>
        <span className="font-light text-sm text-zinc-400 font-mono">(id: {bill.billId})</span>
      </div>

      <div className="flex flex-col lg:flex-row space-y-4 lg:space-x-4">

        <div className="flex flex-col w-full h-60 p-5 rounded-md bg-zinc-700">
          <div className="flex flex-row w-full h-12 items-center overflow-hidden">
            <span className="w-1/3 h-1/2 text-zinc-400 text-center font-mono">bill_id: </span>
            <span className="w-2/3 h-1/2 text-zinc-200 text-right font-mono">{bill.billId}</span>
          </div>

          <div className="flex flex-row w-full h-12 items-center overflow-hidden">
            <span className="w-1/3 h-1/2 text-zinc-400 text-center font-mono">store_name: </span>
            <span className="w-2/3 h-1/2 text-zinc-200 text-right font-mono">{bill.storeName}</span>
          </div>

          <div className="flex flex-row w-full h-12 items-center overflow-hidden">
            <span className="w-1/3 h-1/2 text-zinc-400 text-center font-mono">order_date: </span>
            <span className="w-2/3 h-1/2 text-zinc-200 text-right font-mono">{bill.orderDate.toISOString()}</span>
          </div>

          <div className="flex flex-row w-full h-12 items-center overflow-hidden">
            <span className="w-1/3 h-1/2 text-zinc-400 text-center font-mono">order_by: </span>
            <span className="w-2/3 h-1/2 text-zinc-200 text-right font-mono overflow-scroll">{bill.orderBy?.toString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
