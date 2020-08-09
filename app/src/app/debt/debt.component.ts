import { Component, OnInit } from '@angular/core';
import { DebtsService } from '../debts.service';
import { Debt } from '../debts-model';

@Component({
  selector: 'app-debt',
  templateUrl: './debt.component.html',
  styleUrls: ['./debt.component.css']
})
export class DebtComponent implements OnInit {

  public successMsg: string;
  public errorMsg: string;
  debtValue: string;
  interestRate: string;
  minimumPayment: string;

  constructor(private debtService: DebtsService) { }

  ngOnInit() {
  }

  createDebt() {
    this.successMsg = '';
    this.errorMsg = '';
    this.debtService.createDebt(this.debtValue, this.interestRate, this.minimumPayment)
      .subscribe((createdDebt: Debt) => {
        this.debtValue = '';
        this.interestRate = '';
        this.minimumPayment = '';
        const debtValue = createdDebt.debtValue;
        this.successMsg = `Debt added Successfully for ${this.debtValue}`;
      },
        (error: ErrorEvent) => {
          this.errorMsg = error.error.message;
        });
  }

}
