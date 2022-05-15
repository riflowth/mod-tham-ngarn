import { Staff } from "@models/Staff";
import { useEffect, useState } from "react";
import { InputBox } from "@components/InputBox";
import fetch from "@utils/Fetch";
import Swal from "sweetalert2";
import Router from "next/router";

type StaffModalProp = {
  confirm?: boolean;
  current?: Staff;
  action?: string;
};

interface ApiResponse {
  data: Array<Staff>;
}

export const StaffModal = ({ confirm, current, action }: StaffModalProp) => {
  const [input, setInput] = useState({
    staffId: current?.staffId || 0,
    password: current?.password || "",
    fullName: current?.fullName || "",
    branchId: current?.branchId || 0,
    zoneId: current?.zoneId || 0,
    telNo: current?.telNo || "",
    salary: current?.salary || 0,
    position: current?.position || "",
    dob: current?.dateOfBirth || new Date(),
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
            .post<ApiResponse>(`/staff`, input)
            .then(() => {
              Swal.fire("Added!", "Your info has been added.", "success");
              Router.reload();
            })
            .catch((error: any) =>
              Swal.fire("Failed", error.response.data.message, "error")
            );
          } else if (action == 'edit') {
            await fetch
            .put<ApiResponse>(`/staff/${current?.staffId}`, {
              staffId: input.staffId == current?.staffId ? undefined : input.staffId,
              password: input.password == '' ? undefined : input.password,
              fullName: input.fullName == current?.fullName ? undefined : input.fullName,
              branchId: input.branchId == current?.branchId ? undefined : input.branchId,
              zoneId: input.zoneId == current?.zoneId ? undefined : input.zoneId,
              telNo: input.telNo == current?.telNo ? undefined : input.telNo,
              salary: input.salary == current?.salary ? undefined : input.salary,
              position: input.position == current?.position ? undefined : input.position,
              dob: input.dob == current?.dateOfBirth ? undefined : input.dob,
            }).then(() => {
              Swal.fire("Added!", "Your info has been updated.", "success");
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
        Staff
      </div>
      <form className="w-full space-y-2">
        <div className="flex flex-col justify-around space-y-1">
          <label className="">Full Name</label>
          <InputBox
            name="fullName"
            type="text"
            value={input.fullName}
            onChange={handleInput}
          />
        </div>
        <div className="flex flex-col justify-around space-y-1">
          <label>Password</label>
          <InputBox
            name="password"
            type="password"
            value={input.password}
            onChange={handleInput}
          />
        </div>
        <div className="flex flex-col justify-around space-y-1">
          <label>BranchId</label>
          <InputBox
            name="branchId"
            type="number"
            value={input.branchId}
            onChange={handleInput}
          />
        </div>
        <div className="flex flex-col justify-around space-y-1">
          <label>ZoneId</label>
          <InputBox
            name="zoneId"
            type="number"
            value={input.zoneId}
            onChange={handleInput}
          />
        </div>
        <div className="flex flex-col justify-around space-y-1">
          <label>Telno.</label>
          <InputBox
            name="telNo"
            type="tel"
            value={input.telNo}
            onChange={handleInput}
          />
        </div>
        <div className="flex flex-col justify-around space-y-1">
          <label>Salary</label>
          <InputBox
            name="salary"
            type="number"
            value={input.salary}
            onChange={handleInput}
          />
        </div>
        <div className="flex flex-col justify-around space-y-1">
          <label>Position</label>
          <InputBox
            name="position"
            type="text"
            value={input.position}
            onChange={handleInput}
          />
        </div>
        <div className="flex flex-col justify-around space-y-1">
          <label>Date of birth</label>
          <InputBox
            name="dob"
            type="date"
            value={input.dob.toString()}
            onChange={handleInput}
          />
        </div>
      </form>
    </div>
  );
};
