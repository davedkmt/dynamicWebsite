import { Component, OnInit } from '@angular/core';
import { DebtsService } from '../debts.service';
import { Debt } from '../debts-model';
import { mergeMap } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  public successMsg: string;
  public errorMsg: string;
  debtValue: string;
  interestRate: string;
  minimumPayment: string;

  public loading = true;
  public debts: Debt[];
  public columns = ['debtValue', 'interestRate', 'minimumPayment', 'cancel'];

  constructor(private debtService: DebtsService) { }

  ngOnInit() {
    this.debtService.getDebts()
      .subscribe((debts: Debt[]) => {
        this.debts = debts;
        this.loading = false;
      },
        (error: ErrorEvent) => {
          this.errorMsg = error.error.message;
          this.loading = false;
        });
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
        this.successMsg = `Debt added Successfully`;

        this.debtService.getDebts()
          .subscribe((debts: Debt[]) => {
            this.debts = debts;
            this.loading = false;
          },
            (error: ErrorEvent) => {
              this.errorMsg = error.error.message;
              this.loading = false;
            });
      },
        (error: ErrorEvent) => {
          this.errorMsg = error.error.message;
        });
  }

  cancelDebt(id: string) {
    this.debtService.cancelDebt(id)
      .pipe(
        mergeMap(() => this.debtService.getDebts())
      )
      .subscribe((debts: Debt[]) => {
        this.debts = debts;
        this.successMsg = 'Successfully deleted debt';
      },
        (error: ErrorEvent) => {
          this.errorMsg = error.error.message;
        });
  }

}

