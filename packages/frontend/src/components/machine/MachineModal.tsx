import { Machine } from "@models/Machine";
import { useEffect, useState } from "react";
import { InputBox } from "@components/InputBox";
import fetch from "@utils/Fetch";
import Swal from "sweetalert2";
import Router from "next/router";

type MachineModalProp = {
  confirm?: boolean;
  current?: Machine & { storeName: string };
};

interface ApiResponse {
  data: Array<Machine>;
}

export const MachineModal = ({ confirm, current }: MachineModalProp) => {
  const [input, setInput] = useState({
    machineId: current?.machineId || 0,
    name: current?.name || "",
    zoneId: current?.zoneId || 0,
    serial: current?.serial || "",
    manufacturer: current?.manufacturer || "",
    registrationDate: current?.registrationDate || new Date(),
    retiredDate: current?.retiredDate || new Date(),
    price: current?.price || 0,
    storeName: current?.storeName || "",
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
              Swal.fire("Success!", "Your file has been added.", "success");
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
          <label>Name</label>
          <InputBox
            name="name"
            type="text"
            value={input.name}
            onChange={handleInput}
          />
        </div>
        <div className="flex flex-col justify-around space-y-1">
          <label htmlFor="">ZoneId</label>
          <InputBox
            name="zoneId"
            type="number"
            value={input.zoneId}
            onChange={handleInput}
          />
        </div>
        <div className="flex flex-col justify-around space-y-1">
          <label htmlFor="">Serial</label>
          <InputBox
            name="serial"
            type="text"
            value={input.serial}
            onChange={handleInput}
          />
        </div>
        <div className="flex flex-col justify-around space-y-1">
          <label htmlFor="">Manufacturer</label>
          <InputBox
            name="manufacturer"
            type="text"
            value={input.manufacturer}
            onChange={handleInput}
          />
        </div>
        <div className="flex flex-col justify-around space-y-1">
          <label htmlFor="">Registration date</label>
          <InputBox
            name="registrationDate"
            type="date"
            value={input.registrationDate.toString()}
            onChange={handleInput}
          />
        </div>
        <div className="flex flex-col justify-around space-y-1">
          <label htmlFor="">Retired date</label>
          <InputBox
            name="retiredDate"
            type="date"
            value={input.retiredDate.toString()}
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
        <div className="flex flex-col justify-around space-y-1">
          <label htmlFor="">Store Name</label>
          <InputBox
            name="storeName"
            type="string"
            value={input.storeName}
            onChange={handleInput}
          />
        </div>
      </form>
    </div>
  );
};
