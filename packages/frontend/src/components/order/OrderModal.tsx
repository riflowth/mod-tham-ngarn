import { useEffect, useState } from "react";
import { InputBox } from "@components/InputBox";
import fetch from "@utils/Fetch";
import Swal from "sweetalert2";
import Router from "next/router";
import { Order } from '@models/Order';

type OrderModalProp = {
  confirm?: boolean;
  current?: Order ;
  billId?: number;
};

interface ApiResponse {
  data: Array<Order>;
}

export const OrderModal = ({ confirm, current, billId }: OrderModalProp) => {
  const [input, setInput] = useState({
    machineId: current?.machineId || 0,
    partId: current?.partId || 0,
    price: current?.price || 0,
  });

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    const submit = async () => {
      try {
        if (confirm) {
          await fetch
            .post<ApiResponse>(`/bill/${billId}/order`, {
              machineId: input.machineId == 0 ? undefined : input.machineId,
              partId: input.partId == 0 ? undefined : input.partId,
              price: input.price == 0 ? undefined : input.price,
            })
            .then(() => {
              Swal.fire("Success!", "Your file has been add.", "success");
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
        Order
      </div>
      <form className="w-full space-y-2">
        <div className="flex flex-col justify-around space-y-1">
          <label>machineId</label>
          <InputBox
            name="machineId"
            type="number"
            value={input.machineId}
            onChange={handleInput}
          />
        </div>
        <div className="flex flex-col justify-around space-y-1">
          <label htmlFor="">partId</label>
          <InputBox
            name="partId"
            type="number"
            value={input.partId}
            onChange={handleInput}
          />
        </div>
        <div className="flex flex-col justify-around space-y-1">
          <label htmlFor="">price</label>
          <InputBox
            name="price"
            type="number"
            value={input.price}
            onChange={handleInput}
          />
        </div>
      </form>
    </div>
  );
};
