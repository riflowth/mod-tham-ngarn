import { useEffect, useState } from "react";
import fetch from "@utils/Fetch";
import Swal from "sweetalert2";
import Router from "next/router";
import { MaintenancePart } from '@models/MaintenancePart';

type UpdateMaintenancePartStatusModalProp = {
  confirm?: boolean;
  current?: MaintenancePart;
  action?: string;
  maintenanceId?: number;
  partId?: number;
};

interface ApiResponse {
  data: Array<MaintenancePart>;
}

export enum MaintenancePartStatus {
  ORDERING = 'ORDERING',
  MAINTAINING = 'MAINTAINING',
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED',
}

export const UpdateMaintenancePartStatusModal = ({ confirm, current, maintenanceId, partId }: UpdateMaintenancePartStatusModalProp) => {
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
              .put<ApiResponse>(`/maintenance/${maintenanceId}/part/${partId}/status`, {
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
          <label>change to ordering</label>
          <input
            name="status"
            type="radio"
            value={MaintenancePartStatus.ORDERING}
            onChange={handleInput}
          />
        </div>

        <div className="flex flex-row space-y-1">
          <label>change to maintaining</label>
          <input
            name="status"
            type="radio"
            value={MaintenancePartStatus.MAINTAINING}
            onChange={handleInput}
          />
        </div>
        <div className="flex flex-row space-y-1">
          <label>change to success</label>
          <input
            name="status"
            type="radio"
            value={MaintenancePartStatus.SUCCESS}
            onChange={handleInput}
          />
        </div>
        <div className="flex flex-row space-y-1">
          <label>change to failed</label>
          <input
            name="status"
            type="radio"
            value={MaintenancePartStatus.FAILED}
            onChange={handleInput}
          />
        </div>
      </form>
    </div>
  );
};
