import { useEffect, useState } from "react";
import { InputBox } from "@components/InputBox";
import fetch from "@utils/Fetch";
import Swal from "sweetalert2";
import Router from "next/router";
import { Order } from "@models/Order";
import { MachinePart } from "@models/MachinePart";

type OrderModalProp = {
  confirm?: boolean;
  current?: MachinePart;
  machineId?: number;
  action?: string;
};

interface ApiResponse {
  data: Array<MachinePart>;
}

export const MachinePartsModal = ({
  confirm,
  current,
  machineId,
  action,
}: OrderModalProp) => {
  const [input, setInput] = useState({
    machineId: current?.machineId || 0,
    partId: current?.partId || 0,
    partName: current?.partName || "",
    status: current?.status || "",
  });

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    const submit = async () => {
      try {
        if (confirm) {
          if (action == "add") {
            await fetch
              .post<ApiResponse>(`/part`, {
                machineId: machineId,
                partId: input.partId == 0 ? undefined : input.partId,
                partName: input.partName == "" ? undefined : input.partName,
                status: input.status == "" ? undefined : input.status,
              })
              .then(() => {
                Swal.fire("Success!", "Your file has been add.", "success");
                Router.reload();
              })
              .catch((error: any) =>
                Swal.fire("Failed", error.response.data.message, "error")
              );
          } else if (action == "edit") {
            await fetch
              .put<ApiResponse>(`/part/${current?.partId}`, {
                machineId: machineId,
                partName:
                  input.partName == current?.partName
                    ? undefined
                    : input.partName,
                status:
                  input.status == current?.status ? undefined : input.status,
              })
              .then(() => {
                Swal.fire("Added!", "Your info has been updated.", "success");
                Router.reload();
              })
              .catch((error: any) =>
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
        MachinePart
      </div>
      <form className="w-full space-y-2">
        <div className="flex flex-col justify-around space-y-1">
          <label htmlFor="">partName</label>
          <InputBox
            name="partName"
            type="text"
            value={input.partName}
            onChange={handleInput}
          />
        </div>
        <div className="flex flex-col justify-around space-y-1">
          <label htmlFor="">status</label>
          <InputBox
            name="status"
            type="text"
            value={input.status}
            onChange={handleInput}
          />
        </div>
      </form>
    </div>
  );
};
