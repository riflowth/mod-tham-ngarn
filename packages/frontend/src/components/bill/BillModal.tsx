import { Bill } from "@models/Bill";
import { useEffect, useState } from "react";
import { InputBox } from "@components/InputBox";
import fetch from "@utils/Fetch";
import Swal from "sweetalert2";
import Router from "next/router";

type MachineModalProp = {
  confirm?: boolean;
  current?: Bill;
};

interface ApiResponse {
  data: Array<Bill>;
}

export const BillModal = ({ confirm, current }: MachineModalProp) => {
  const [input, setInput] = useState({
    billId: current?.billId || 0,
    storeName: current?.storeName || "",
    orderDate: current?.orderDate || new Date(),
    orderBy: current?.orderBy || 0,
  });

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    const submit = async () => {
      try {
        if (confirm) {
          await fetch
            .post<ApiResponse>(`/bill`, input)
            .then(() => {
              Swal.fire("Success!", "Your bill has been add.", "success");
              Router.reload();
            })
            .catch((error: any) =>
              Swal.fire("Failed", error.response.data.message, "error")
            );
        }
      } catch (e) {
        console.log(e);
      }
    };

    submit();
  }, [confirm, input]);

  return (
    <div className="space-y-2 text-white">
      <div className="p-2 font-semibold text-center rounded-md bg-violet-400 ">
        Bills
      </div>
      <form className="w-full space-y-2">
        <div className="flex flex-col justify-around space-y-1">
          <label>Store name</label>
          <InputBox
            name="storeName"
            type="text"
            value={input.storeName}
            onChange={handleInput}
          />
        </div>
        <div className="flex flex-col justify-around space-y-1">
          <label htmlFor="">Order date</label>
          <InputBox
            name="orderDate"
            type="date"
            value={input.orderDate.toString()}
            onChange={handleInput}
          />
        </div>
        <div className="flex flex-col justify-around space-y-1">
          <label htmlFor="">Order by</label>
          <InputBox
            name="orderBy"
            type="number"
            value={input.orderBy}
            onChange={handleInput}
          />
        </div>
      </form>
    </div>
  );
};
