import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { User, UserDetails } from '../models/user.model';
import { delay } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class UserService {
  private users: User[] = [
    { id: 1, name: 'דני כהן' },
    { id: 2, name: 'שרה לוי' },
    { id: 3, name: 'יוסי אברהם' },
    { id: 4, name: 'רחל רוזן' },
    { id: 5, name: 'אבי ישראל' },
    { id: 6, name: 'מיכל דוד' },
    { id: 7, name: 'רון ברק' },
    { id: 8, name: 'נועה שמיר' },
    { id: 9, name: 'עומר זהבי' },
    { id: 10, name: 'תמר גולן' },
    { id: 11, name: 'אלון פרידמן' },
    { id: 12, name: 'ליאת מזרחי' },
  ];

  constructor() {}

  getUsers(): Observable<User[]> {
    return of([...this.users]).pipe(delay(500));
  }

  saveUser(user: User): Observable<User> {
    return new Observable((observer) => {
      setTimeout(() => {
        try {
          const existingIndex = this.users.findIndex((u) => u.id === user.id);

          if (existingIndex >= 0) {
            this.users[existingIndex] = { ...user };
            console.log('User updated:', user);
          } else {
            const idExists = this.users.some((u) => u.id === user.id);
            if (idExists) {
              observer.error(new Error(`User with ID ${user.id} already exists`));
              return;
            }
            this.users.push({ ...user });
            console.log('User added:', user);
          }

          observer.next(user);
          observer.complete();
        } catch (error) {
          observer.error(error);
        }
      }, 500);
    });
  }

  deleteUser(userId: number): Observable<void> {
    return new Observable((observer) => {
      setTimeout(() => {
        try {
          const index = this.users.findIndex((u) => u.id === userId);
          if (index === -1) {
            observer.error(new Error(`User with ID ${userId} not found`));
            return;
          }

          this.users.splice(index, 1);
          console.log('User deleted:', userId);
          observer.next();
          observer.complete();
        } catch (error) {
          observer.error(error);
        }
      }, 500);
    });
  }

  getUserDetails(userId: number): Observable<UserDetails> {
    console.log(`🔄 API Call: Fetching details for user ${userId}`);

    return new Observable((observer) => {
      const delay = Math.random() * 2000 + 1000;

      setTimeout(() => {
        const user = this.users.find((u) => u.id === userId);

        if (!user) {
          console.log(`❌ API Error: User ${userId} not found`);
          observer.error(new Error(`User with ID ${userId} not found`));
          return;
        }

        const userDetails: UserDetails = {
          id: user.id,
          name: user.name,
          email: `user@example.com`,
          phone: `05${Math.floor(Math.random() * 10)}-${Math.floor(
            Math.random() * 9000000 + 1000000
          )}`,
          address: {
            street: [
              `רחוב הרצל ${Math.floor(Math.random() * 100) + 1}`,
              `רחוב בן גוריון ${Math.floor(Math.random() * 100) + 1}`,
              `רחוב דיזנגוף ${Math.floor(Math.random() * 100) + 1}`,
              `רחוב רוטשילד ${Math.floor(Math.random() * 100) + 1}`,
              `רחוב אלנבי ${Math.floor(Math.random() * 100) + 1}`,
              `רחוב ביאליק ${Math.floor(Math.random() * 100) + 1}`,
            ][Math.floor(Math.random() * 6)],
            city: [
              'תל אביב',
              'ירושלים',
              'חיפה',
              'באר שבע',
              'נתניה',
              'פתח תקווה',
              'דימונה',
              'אשדוד',
              'ראשון לציון',
            ][Math.floor(Math.random() * 9)],
            zipCode: `${Math.floor(Math.random() * 90000) + 10000}`,
          },
          joinDate: new Date(
            2020 + Math.floor(Math.random() * 4),
            Math.floor(Math.random() * 12),
            Math.floor(Math.random() * 28) + 1
          )
            .toISOString()
            .split('T')[0],
          lastLogin: new Date(
            Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000
          ).toISOString(),
          preferences: {
            newsletter: Math.random() > 0.5,
            notifications: Math.random() > 0.3,
            theme: Math.random() > 0.5 ? 'light' : 'dark',
          },
          statistics: {
            totalOrders: Math.floor(Math.random() * 50) + 1,
            totalSpent: Math.floor(Math.random() * 5000) + 100,
            averageOrderValue: Math.floor(Math.random() * 200) + 50,
            favoriteCategory: ['אלקטרוניקה', 'ספרים', 'ביגוד', 'בית וגן', 'ספורט'][
              Math.floor(Math.random() * 5)
            ],
          },
        };

        console.log(`✅ API Success: User ${userId} details loaded after ${delay.toFixed(0)}ms`);
        observer.next(userDetails);
        observer.complete();
      }, delay);
    });
  }
}
