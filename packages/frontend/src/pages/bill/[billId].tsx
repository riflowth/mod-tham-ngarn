import { BillBoard } from '@components/bill/BillBoard';
import { OrderItems } from '@components/order/OrderItems';
import { Dashboard } from '@components/dashboard/Dashboard';
import { withUser } from '@components/hoc/withUser';
import { TableComponent } from '@components/table/TableComponent';
import { Order } from '@models/Order';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { OrderModal } from '@components/order/OrderModal';

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
          <OrderModal billId={billId} />
        </TableComponent>
      </div>

    </Dashboard>
  );
};

export default withUser(MaintenancePage);
