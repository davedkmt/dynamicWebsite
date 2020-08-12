import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Debt } from './debts-model';

@Injectable({
  providedIn: 'root'
})
export class DebtsService {

    private BASE_URL = '/api'

  constructor(private http: HttpClient) { }

  getDebts(): Observable<Debt[]> {
    return this.http.get<Debt[]>(`${this.BASE_URL}/debts`);
  }

  createDebt(debtValue: number, interestRate: number, minimumPayment: number): Observable<Debt> {
    return this.http.post<Debt>(`${this.BASE_URL}/debts`, { debtValue, interestRate, minimumPayment });
  }

  cancelDebt(id: string): Observable<any> {
    return this.http.delete(`${this.BASE_URL}/debts/${id}`);
  }
}
