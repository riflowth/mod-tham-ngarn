import { Bill } from "@models/Bill";
import { useEffect, useState } from "react";
import { InputBox } from "@components/InputBox";
import fetch from "@utils/Fetch";
import Swal from "sweetalert2";
import Router from "next/router";
import { useAuth } from "@hooks/auth/AuthContext";

type MachineModalProp = {
  confirm?: boolean;
  current?: Bill;
  action?: string;
};

interface ApiResponse {
  data: Array<Bill>;
}

export const BillModal = ({ confirm, current, action }: MachineModalProp) => {
  const { user } = useAuth();
  const [input, setInput] = useState({
    billId: current?.billId || 0,
    storeName: current?.storeName || "",
    orderDate: current?.orderDate || new Date(),
    orderBy: action == 'add' ? user?.staffId : current?.orderBy || 0,
  });

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    const submit = async () => {
      try {
        if (confirm) {
          if (action == 'add') {
            await fetch
              .post<ApiResponse>(`/bill`, input)
              .then(() => {
                Swal.fire("Success!", "Your bill has been added.", "success");
                Router.reload();
              })
              .catch((error: any) =>
                Swal.fire("Failed", error.response.data.message, "error")
              );
          } else if (action == 'edit') {
            await fetch
              .put<ApiResponse>(`/bill/${current?.billId}`, {
                storeName: input.storeName == current?.storeName ? undefined : input.storeName,
                orderDate: input.orderDate == current?.orderDate ? undefined : input.orderDate,
                orderBy: input.orderBy == current?.orderBy ? undefined : input.orderBy,
            }).then(() => {
              Swal.fire("Success!", "Your info has been updated.", "success");
              Router.reload();
            }).catch((error: any) =>
              Swal.fire("Failed", error.response.data.message, "error")
            );
          }
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
        {(action == 'edit') &&
          <div className="flex flex-col justify-around space-y-1">
            <label htmlFor="">Order by</label>
            <InputBox
              name="orderBy"
              type="number"
              value={input.orderBy!}
              onChange={handleInput}
            />
          </div>
        }
      </form>
    </div>
  );
};
