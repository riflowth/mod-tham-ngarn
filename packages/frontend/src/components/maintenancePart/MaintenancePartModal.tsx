import { useEffect, useState } from "react";
import { InputBox } from "@components/InputBox";
import fetch from "@utils/Fetch";
import Swal from "sweetalert2";
import Router from "next/router";
import { MaintenancePart } from '@models/MaintenancePart';

type MaintenancePartModalProp = {
  confirm?: boolean;
  current?: MaintenancePart;
  maintenanceId?: number;
};

interface ApiResponse {
  data: Array<MaintenancePart>;
}

export const MaintenancePartModal = ({ confirm, current, maintenanceId }: MaintenancePartModalProp) => {
  const [input, setInput] = useState({
    partId: current?.partId || 0,
    type: current?.type || "",  
    orderId: current?.orderId || 0,
  });

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    const submit = async () => {
      try {
        if (confirm) {
          await fetch
            .post<ApiResponse>(`/maintenance/${maintenanceId}/part`, input)
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
          <label>PartId</label>
          <InputBox
            name="partId"
            type="number"
            value={input.partId}
            onChange={handleInput}
          />
        </div>
        <div className="flex flex-col justify-around space-y-1">
          <label htmlFor="">Type</label>
          <InputBox
            name="type"
            type="string"
            value={input.type}
            onChange={handleInput}
          />
        </div>
        <div className="flex flex-col justify-around space-y-1">
          <label htmlFor="">OrderId</label>
          <InputBox
            name="orderId"
            type="number"
            value={input.orderId}
            onChange={handleInput}
          />
        </div>
      </form>
    </div>
  );
};
