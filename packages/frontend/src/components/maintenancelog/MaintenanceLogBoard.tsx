import { PencilIcon, TicketIcon } from '@heroicons/react/outline';
import Step from '@mui/material/Step';
import StepContent from '@mui/material/StepContent';
import StepLabel from '@mui/material/StepLabel';
import Stepper from '@mui/material/Stepper';
import fetch from '@utils/Fetch';
import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';

type MaintenanceLog = {
  maintenanceId: number;
  machineId: number;
  reporterId: number;
  maintainerId: number;
  reportDate: Date;
  maintenanceDate: Date;
  reason: string;
  status: MaintenanceLogStatus;
};

enum MaintenanceLogStatus {
  OPENED = 'OPENED',
  PENDING = 'PENDING',
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED',
};

type ApiResponse<T> = {
  data: T,
};

const steps = [
  { label: 'OPENED' },
  { label: 'PENDING' },
  { label: 'DONE' },
];

type MaintenanceBoardProps = {
  maintenanceId: number,
};

const swalWhenError = async (func: () => Promise<void>) => {
  try {
    await func();
  } catch (e: any) {
    Swal.fire("Failed", e.response.data.message, "error");
  }
};

export const MaintenanceBoard = ({
  maintenanceId,
}: MaintenanceBoardProps) => {
  const [maintenanceLog, setMaintenanceLog] = useState<MaintenanceLog>();
  const [totalPrice, setTotalPrice] = useState(0);

  const initialStep = maintenanceLog ? Object.keys(MaintenanceLogStatus).indexOf(maintenanceLog.status) : 0;
  const [activeStep, setActiveStep] = useState(initialStep);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch.get<ApiResponse<MaintenanceLog>>(`/maintenance/${maintenanceId}`);
        const response2 = await fetch.get<ApiResponse<any>>(`bill/maintenance/${maintenanceId}`);
        setMaintenanceLog(response.data.data);
        setTotalPrice(response2.data.data.totalPrice);
        setActiveStep(Object.keys(MaintenanceLogStatus).indexOf(response.data.data.status));
      } catch (e) {
        // TODO
        return {};
      }
    };
    fetchData();
  }, [maintenanceId]);

  const handleClaim = async () => {
    await swalWhenError(async () => {
      await fetch.get<MaintenanceLog>(`/maintenance/${maintenanceId}/claim`);
      setActiveStep(1);
    });
  }

  const handleUnclaim = async () => {
    await swalWhenError(async () => {
      await fetch.get<MaintenanceLog>(`/maintenance/${maintenanceId}/unclaim`);
      setActiveStep(0);
    });
  }

  const handleSuccess = async () => {
    await swalWhenError(async () => {
      await fetch.put<MaintenanceLog>(`/maintenance/${maintenanceId}/status`, { status: MaintenanceLogStatus.SUCCESS })
      steps[2].label = MaintenanceLogStatus.SUCCESS;
      setActiveStep(2);
    });
  }

  const handleFailed = async () => {
    await swalWhenError(async () => {
      await fetch.put<MaintenanceLog>(`/maintenance/${maintenanceId}/status`, { status: MaintenanceLogStatus.FAILED })
      steps[2].label = MaintenanceLogStatus.FAILED;
      setActiveStep(2);
    });
  }

  if (!maintenanceLog) {
    return <div>Loading...</div>;
  }

  return (
    <div className="w-full overflow-y-auto mb-4">
      <div className="flex flex-row items-center mb-4">
        <h1 className="text-white font-semibold text-lg mr-2">Maintenance</h1>
        <span className="font-light text-sm text-zinc-400 font-mono">(id: {maintenanceLog.maintenanceId})</span>
      </div>

      <div className="flex flex-col lg:flex-row space-y-4 lg:space-x-4">
        
        <div className="flex p-5 rounded-md bg-zinc-700">
          <Stepper activeStep={activeStep} orientation="vertical">
            {steps.map((step) => (
              <Step key={step.label}>
                <StepLabel>{step.label}</StepLabel>
                <StepContent>
                  <div className="mb-2 flex">
                    <div className="flex">
                      {step.label === 'OPENED' && (
                        <div>
                          <button className="flex flex-row items-center text-white text-xs bg-violet-600 hover:bg-violet-700 rounded-md px-2 py-2 transition ease-in duration-100" onClick={handleClaim}>
                            <div className="w-5 bg-violet-300 text-violet-700 mr-1 p-1 rounded-md"><TicketIcon /></div>
                            <div className="font-medium tracking-tight">Claim this maintenance</div>
                          </button>
                        </div>
                      )}
                      {step.label === 'PENDING' && (
                        <div className="flex flex-col">
                          <div>
                            <button className="flex flex-row items-center text-white text-xs bg-violet-600 hover:bg-violet-700 rounded-md px-2 py-2 transition ease-in duration-100" onClick={handleUnclaim}>
                              <div className="w-5 bg-violet-300 text-violet-700 mr-1 p-1 rounded-md"><PencilIcon /></div>
                              <div className="font-medium tracking-tight">Unclaim</div>
                            </button>
                          </div>

                          <div className="flex flex-row">
                            <button className="flex flex-row items-center text-white text-xs bg-violet-600 hover:bg-violet-700 rounded-md px-2 py-2 transition ease-in duration-100" onClick={handleSuccess}>
                              <div className="w-5 bg-violet-300 text-violet-700 mr-1 p-1 rounded-md"><PencilIcon /></div>
                              <div className="font-medium tracking-tight">success</div>
                            </button>
                            <button className="flex flex-row items-center text-white text-xs bg-violet-600 hover:bg-violet-700 rounded-md px-2 py-2 transition ease-in duration-100" onClick={handleFailed}>
                              <div className="w-5 bg-violet-300 text-violet-700 mr-1 p-1 rounded-md"><PencilIcon /></div>
                              <div className="font-medium tracking-tight">failed</div>
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </StepContent>
              </Step>
            ))}
          </Stepper>
        </div>

        <div className="flex flex-col w-full h-60 p-5 rounded-md bg-zinc-700">
          <div className="flex flex-row w-full h-12 items-center overflow-hidden">
            <span className="w-1/3 h-1/2 text-zinc-400 text-center font-mono">machine_id: </span>
            <span className="w-2/3 h-1/2 text-zinc-200 text-right font-mono">{maintenanceLog.machineId}</span>
          </div>

          <div className="flex flex-row w-full h-12 items-center overflow-hidden">
            <span className="w-1/3 h-1/2 text-zinc-400 text-center font-mono">reporter_id: </span>
            <span className="w-2/3 h-1/2 text-zinc-200 text-right font-mono">{maintenanceLog.reporterId}</span>
          </div>

          <div className="flex flex-row w-full h-12 items-center overflow-hidden">
            <span className="w-1/3 h-1/2 text-zinc-400 text-center font-mono">maintainer_id: </span>
            <span className="w-2/3 h-1/2 text-zinc-200 text-right font-mono">{maintenanceLog.maintainerId}</span>
          </div>

          <div className="flex flex-row w-full h-12 items-center overflow-hidden">
            <span className="w-1/3 h-1/2 text-zinc-400 text-center font-mono">report_date: </span>
            <span className="w-2/3 h-1/2 text-zinc-200 text-right font-mono overflow-scroll">{maintenanceLog.reportDate?.toString()}</span>
          </div>

          <div className="flex flex-row w-full h-12 items-center">
            <span className="w-1/3 h-1/2 text-zinc-400 text-center font-mono">maintenance_date: </span>
            <span className="w-2/3 h-1/2 text-zinc-200 text-right font-mono overflow-scroll">{maintenanceLog.maintenanceDate?.toString()}</span>
          </div>

          <div className="flex flex-row w-full h-12 items-center">
            <span className="w-1/3 h-1/2 text-zinc-400 text-center font-mono">total price: </span>
            <span className="w-2/3 h-1/2 text-zinc-200 text-right font-mono overflow-scroll">{new Intl.NumberFormat('th-TH').format(totalPrice) + ' ฿'}</span>
          </div>
        </div>

        <div className="flex flex-col w-full max-h-60  overflow-hidden p-5 rounded-md bg-zinc-700">
          <h2 className="font-black text-2xl text-zinc-400 mb-6">Reason</h2>
          <span className="text-zinc-200  overflow-scroll">{maintenanceLog.reason}</span>
        </div>

      </div>
    </div>
  );
}
