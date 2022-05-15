import { MaintenanceLog } from "@models/MaintenanceLog";
import { useEffect, useState } from "react";
import { InputBox } from "@components/InputBox";
import fetch from "@utils/Fetch";
import Swal from "sweetalert2";
import Router from "next/router";

type MachineModalProp = {
  confirm?: boolean;
  current?: MaintenanceLog;
};

interface ApiResponse {
  data: Array<MaintenanceLog>;
}

export const MachineModal = ({ confirm, current }: MachineModalProp) => {
  const [input, setInput] = useState({
    maintenanceId: current?.maintenanceId || 0,
    machineId: current?.machineId || 0,
    reporterId: current?.reporterId || 0,
    maintainerId: current?.maintainerId || "",
    reportDate: current?.reportDate || new Date(),
    maintenanceDate: current?.maintenanceDate || new Date(),
    reason: current?.reason || "",
    status: current?.status || "",
  });

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    const submit = async () => {
      try {
        if (confirm) {
          await fetch
            .post<ApiResponse>(`/machine`, input)
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
        Machine
      </div>
      <form className="w-full space-y-2">
        <div className="flex flex-col justify-around space-y-1">
          <label>MachineId</label>
          <InputBox
            name="machineId"
            type="number"
            value={input.machineId}
            onChange={handleInput}
          />
        </div>
        <div className="flex flex-col justify-around space-y-1">
          <label htmlFor="">ReporterId</label>
          <InputBox
            name="reporterId"
            type="number"
            value={input.reporterId}
            onChange={handleInput}
          />
        </div>
        <div className="flex flex-col justify-around space-y-1">
          <label htmlFor="">MaintainerId</label>
          <InputBox
            name="maintainerId"
            type="text"
            value={input.maintainerId}
            onChange={handleInput}
          />
        </div>
        <div className="flex flex-col justify-around space-y-1">
          <label htmlFor="">Report date</label>
          <InputBox
            name="reportDate"
            type="date"
            value={input.reportDate.toString()}
            onChange={handleInput}
          />
        </div>
        <div className="flex flex-col justify-around space-y-1">
          <label htmlFor="">Maintenance date</label>
          <InputBox
            name="maintenanceDate"
            type="date"
            value={input.maintenanceDate.toString()}
            onChange={handleInput}
          />
        </div>
        <div className="flex flex-col justify-around space-y-1">
          <label htmlFor="">Reason</label>
          <InputBox
            name="reason"
            type="date"
            value={input.reason}
            onChange={handleInput}
          />
        </div>
        <div className="flex flex-col justify-around space-y-1">
          <label htmlFor="">Status</label>
          <InputBox
            name="status"
            type="date"
            value={input.status}
            onChange={handleInput}
          />
        </div>
      </form>
    </div>
  );
};
