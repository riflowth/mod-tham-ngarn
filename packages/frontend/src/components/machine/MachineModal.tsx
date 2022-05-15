import { Machine } from "@models/Machine";
import { useEffect, useState } from "react";
import { InputBox } from "@components/InputBox";
import fetch from "@utils/Fetch";

type MachineModalProp = {
  confirm?: boolean;
  current?: Machine;
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
  });

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    const submit = async () => {
      try {
        if (confirm) {
          const response = await fetch.post<ApiResponse>(`/machine`, input);
          console.log(response);
        }
      } catch (e) {
        console.log(e);
      }
    };

    submit();
  }, [confirm, input]);

  return (
    <>
      <div>Machine</div>
      <form>
        <div>
          <label>Name</label>
          <InputBox
            name="name"
            type="text"
            value={input.name}
            onChange={handleInput}
          />
        </div>
        <div>
          <label htmlFor="">ZoneId</label>
          <InputBox
            name="zoneId"
            type="number"
            value={input.zoneId}
            onChange={handleInput}
          />
        </div>
        <div>
          <label htmlFor="">Serial</label>
          <InputBox
            name="serial"
            type="text"
            value={input.serial}
            onChange={handleInput}
          />
        </div>
        <div>
          <label htmlFor="">Manufacturer</label>
          <InputBox
            name="manufacturer"
            type="text"
            value={input.manufacturer}
            onChange={handleInput}
          />
        </div>
        <div>
          <label htmlFor="">Registration date</label>
          <InputBox
            name="registrationDate"
            type="date"
            value={input.registrationDate.toString()}
            onChange={handleInput}
          />
        </div>
        <div>
          <label htmlFor="">Retired date</label>
          <InputBox
            name="retiredDate"
            type="date"
            value={input.retiredDate.toString()}
            onChange={handleInput}
          />
        </div>
      </form>
    </>
  );
};
