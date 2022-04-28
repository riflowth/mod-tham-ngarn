import { Order } from '@/entities/Order';
import { Repository } from '@/repositories/Repository';

export interface OrderRepository extends Repository<Order> {

  readByOrderId(orderId: number): Promise<Order>

}
