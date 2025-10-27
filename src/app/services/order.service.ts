import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Order, OrderItem } from '../models/user.model';
import { delay } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class OrderService {
  private productNames = [
    'מחשב נייד',
    'עכבר אלחוטי',
    'מקלדת מכנית',
    'רמקולים',
    'אוזניות',
    'ספר על תכנות',
    'חולצה',
    'מכנסיים',
    'נעליים',
    'תיק',
    'טלפון חכם',
    'מטען',
    'כבל USB',
    'זכוכית מגן',
    'נרתיק',
    'פרחים לבית',
    'עציץ',
    'כלי בישול',
    'מקרר קטן',
    'מיקרוגל',
  ];

  private categories = [
    'אלקטרוניקה',
    'ספרים',
    'ביגוד',
    'בית וגן',
    'ספורט',
    'משחקים',
    'רכב',
    'יופי ובריאות',
  ];

  private statuses: Array<'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'> = [
    'pending',
    'processing',
    'shipped',
    'delivered',
    'cancelled',
  ];

  private orders: Order[] = this.generateMockOrders();

  constructor() {}

  private generateMockOrders(): Order[] {
    const orders: Order[] = [];
    const userIds = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

    for (let i = 1; i <= 20; i++) {
      const userId = userIds[Math.floor(Math.random() * userIds.length)];
      const itemsCount = Math.floor(Math.random() * 4) + 1;
      const items: OrderItem[] = [];
      let total = 0;

      for (let j = 0; j < itemsCount; j++) {
        const price = Math.floor(Math.random() * 500) + 20;
        const quantity = Math.floor(Math.random() * 3) + 1;
        const item: OrderItem = {
          id: j + 1,
          productName: this.productNames[Math.floor(Math.random() * this.productNames.length)],
          quantity: quantity,
          price: price,
          category: this.categories[Math.floor(Math.random() * this.categories.length)],
        };
        items.push(item);
        total += price * quantity;
      }

      const orderDate = new Date();
      orderDate.setDate(orderDate.getDate() - Math.floor(Math.random() * 180));

      orders.push({
        id: i,
        userId: userId,
        total: total,
        orderDate: orderDate.toISOString().split('T')[0],
        status: this.statuses[Math.floor(Math.random() * this.statuses.length)],
        items: items,
      });
    }

    return orders;
  }

  getAllOrders(): Observable<Order[]> {
    return of([...this.orders]).pipe(delay(300));
  }

  getUserOrders(userId: number): Observable<Order[]> {
    const userOrders = this.orders.filter((order) => order.userId === userId);
    return of([...userOrders]).pipe(delay(300));
  }

  addOrder(userId: number, amount: number): Observable<Order> {
    return new Observable((observer) => {
      setTimeout(() => {
        try {
          const newId = Math.max(...this.orders.map((o) => o.id), 0) + 1;

          const orderItem: OrderItem = {
            id: 1,
            productName: 'הזמנה מותאמת אישית',
            quantity: 1,
            price: amount,
            category: 'כללי',
          };

          const newOrder: Order = {
            id: newId,
            userId: userId,
            total: amount,
            orderDate: new Date().toISOString().split('T')[0],
            status: 'pending',
            items: [orderItem],
          };

          this.orders.push(newOrder);

          console.log('Order added:', newOrder);
          observer.next(newOrder);
          observer.complete();
        } catch (error) {
          observer.error(error);
        }
      }, 300);
    });
  }
}
