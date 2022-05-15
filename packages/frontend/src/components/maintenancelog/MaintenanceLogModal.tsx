import { MaintenanceLog } from "@models/MaintenanceLog";
import { useEffect, useState } from "react";
import { InputBox } from "@components/InputBox";
import fetch from "@utils/Fetch";
import Swal from "sweetalert2";
import Router from "next/router";

type MaintenanceLogModalProp = {
  confirm?: boolean;
  current?: MaintenanceLog;
  action?: string;
};

interface ApiResponse {
  data: Array<MaintenanceLog>;
}

export const MaintenanceLogModal = ({ confirm, current, action }: MaintenanceLogModalProp) => {
  const [input, setInput] = useState({
    machineId: current?.machineId || 0,
    reason: current?.reason || "",
  });

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    const submit = async () => {
      try {
        if (confirm) {
          if (action === 'add') {
            await fetch
              .post<ApiResponse>(`/maintenance`, input)
              .then(() => {
                Swal.fire("Success!", "Your file has been add.", "success");
                Router.reload();
              })
              .catch((error: any) =>
                Swal.fire("Failed", error.response.data.message, "error")
              );
          } else if (action === 'edit') {
            await fetch
              .put<ApiResponse>(`/maintenance/${current?.maintenanceId}`, {
                reason: input.reason == current?.reason ? undefined : input.reason,
              })
              .then(() => {
                Swal.fire("Success!", "Your file has been edit.", "success");
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
  }, [confirm, input]);

  return (
    <div className="space-y-2 text-white">
      <div className="p-2 font-semibold text-center rounded-md bg-violet-400 ">
        MaintenanceLog
      </div>
      <form className="w-full space-y-2">
        {action !== 'edit' && <div className="flex flex-col justify-around space-y-1">
          <label>MachineId</label>
          <InputBox
            name="machineId"
            type="number"
            value={input.machineId}
            onChange={handleInput}
          />
        </div>}
        <div className="flex flex-col justify-around space-y-1">
          <label htmlFor="">Reason</label>
          <InputBox
            name="reason"
            type="string"
            value={input.reason}
            onChange={handleInput}
          />
        </div>
      </form>
    </div>
  );
};
