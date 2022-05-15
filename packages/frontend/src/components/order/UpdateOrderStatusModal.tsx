import { useEffect, useState } from "react";
import fetch from "@utils/Fetch";
import Swal from "sweetalert2";
import Router from "next/router";
import { MaintenancePart } from '@models/MaintenancePart';

type UpdateMaintenancePartStatusModalProp = {
  confirm?: boolean;
  current?: MaintenancePart;
  action?: string;
  billId?: number;
  orderId?: number;
};

interface ApiResponse {
  data: Array<MaintenancePart>;
}

export enum OrderStatus {
  SHIPPING = 'SHIPPING',
  DELIVERED = 'DELIVERED',
  CANCELED = 'CANCELED',
}

export const UpdateOrderStatusModal = ({ confirm, current, billId, orderId }: UpdateMaintenancePartStatusModalProp) => {
  const [input, setInput] = useState({
    status: current?.status || '',
  });

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput({ ...input, [e.target.name]: e.target.value });
    console.log(input)
  };

  useEffect(() => {
    const submit = async () => {
      try {
        if (confirm) {
            await fetch
              .put<ApiResponse>(`/bill/${billId}/order/${orderId}/status`, {
                status: input.status,
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
  }, [confirm]);

  return (
    <div className="space-y-2 text-white">
      <div className="p-2 font-semibold text-center rounded-md bg-violet-400 ">
        MaintenancePart
      </div>
      <form className="w-full space-y-2">

        <div className="flex flex-row space-y-1">
          <label>change to shipping</label>
          <input
            name="status"
            type="radio"
            value={OrderStatus.SHIPPING}
            onChange={handleInput}
          />
        </div>

        <div className="flex flex-row space-y-1">
          <label>change to delivered</label>
          <input
            name="status"
            type="radio"
            value={OrderStatus.DELIVERED}
            onChange={handleInput}
          />
        </div>
        <div className="flex flex-row space-y-1">
          <label>change to canceled</label>
          <input
            name="status"
            type="radio"
            value={OrderStatus.CANCELED}
            onChange={handleInput}
          />
        </div>
      </form>
    </div>
  );
};
