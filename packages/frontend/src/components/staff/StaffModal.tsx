import { Staff } from '@models/Staff'
import { useEffect, useState } from 'react';
import { InputBox } from '@components/InputBox';
import fetch from "@utils/Fetch";

type StaffModalProp = {
  confirm?: boolean,
  current?: Staff,
}

interface ApiResponse {
  data: Array<Staff>;
}

export const StaffModal = ({ confirm, current }: StaffModalProp) => {
  const [input, setInput] = useState({
    staffId: current?.staffId || 0,
    password: current?.password || '',
    fullName: current?.fullName || '',
    branchId: current?.branchId || 0,
    zoneId: current?.zoneId || 0,
    telNo: current?.telNo || '',
    salary: current?.salary || 0,
    position: current?.position || '',
    dob: current?.dateOfBirth || new Date(),
  })

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  }

  useEffect(() => {
    const submit = async () => {
      try {
        if (confirm) {
          const response = await fetch.post<ApiResponse>(`/staff`, input);
          console.log(response)
        }
      } catch (e) {
        console.log(e);
      }
    };

    submit();
  }, [confirm, input]);

  return (
    <>
      <div>Staff</div>
      <form>
        full name
        <InputBox name="fullName" type="text" value={input.fullName} onChange={handleInput} />
        Password
        <InputBox name="password" type="password" value={input.password} onChange={handleInput} />
        branchId
        <InputBox name="branchId" type="number" value={input.branchId} onChange={handleInput} />
        zoneId
        <InputBox name="zoneId" type="number" value={input.zoneId} onChange={handleInput} />
        telNo
        <InputBox name="telNo" type="tel" value={input.telNo} onChange={handleInput} />
        Salary
        <InputBox name="salary" type="number" value={input.salary} onChange={handleInput} />
        position
        <InputBox name="position" type="text" value={input.position} onChange={handleInput} />
        dateofbirht
        <InputBox name="dateOfBirth" type="date" value={input.dob.toString()} onChange={handleInput} />
      </form>
    </>
  );
}
