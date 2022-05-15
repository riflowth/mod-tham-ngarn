import { BillBoard } from '@components/bill/BillBoard';
import { OrderItems } from '@components/order/OrderItems';
import { Dashboard } from '@components/dashboard/Dashboard';
import { withUser } from '@components/hoc/withUser';
import { MaintenanceBoard } from '@components/maintenancelog/MaintenanceLogBoard';
import { MaintenancePartItems } from '@components/maintenancePart/MaintenancePartItems';
import { TableComponent } from '@components/table/TableComponent';
import { MaintenancePart } from '@models/MaintenancePart';
import { Order } from '@models/Order';
import { NextPage } from 'next';
import { useRouter } from 'next/router';

const MaintenancePage: NextPage = () => {
  const router = useRouter();
  const billId = Number(router.query.billId);

  return (
    <Dashboard current="Bill">
      <div className="h-full w-full p-8">
        <BillBoard
          billId={billId}
        />
        <TableComponent<Order>
          path={`bill/${billId}/order`}
          title={'order'}
          columns={['orderId', 'machineId', 'partId', 'billId', 'price', 'arrivalDate', 'status', '', '']}
        >
          <OrderItems rows={[]} />
          <div>deleteme</div>
        </TableComponent>
      </div>

    </Dashboard>
  );
};

export default withUser(MaintenancePage);
