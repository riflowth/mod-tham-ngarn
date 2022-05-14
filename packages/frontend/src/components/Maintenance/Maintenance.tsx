import MaintenanceCard from '@components/Maintenance/MaintenanceCard';

type MaintenanceProps = {
  maintenanceId?: number,
}

const Maintenance = ({ maintenanceId }: MaintenanceProps) => {
  return (
    <div>
      <MaintenanceCard maintenanceId={maintenanceId}/>
    </div>
  );
}

export default Maintenance;
