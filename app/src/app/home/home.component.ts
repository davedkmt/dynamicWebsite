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
  debtValue: number;
  interestRate: number;
  minimumPayment: number;
  totalDebt: number;
  totalMonthlyPayment: number;

  public loading = true;
  public debts: Debt[];
  public columns = ['debtValue', 'interestRate', 'minimumPayment', 'cancel'];


  constructor(private debtService: DebtsService) { }

    ngOnInit() {
        this.totalDebt = 0;
        this.totalMonthlyPayment = 0;
        this.debtService.getDebts()
      .subscribe((debts: Debt[]) => {
        this.debts = debts;
          this.loading = false;
          this.totalDebtCalculator(this.debts);
          this.totalMonthlyPaymentCalculator(this.debts);
   
      },
        (error: ErrorEvent) => {
          this.errorMsg = error.error.message;
          this.loading = false;
          });
  }

    totalDebtCalculator(_debts) {
        for (let i = 0; i < this.debts.length; i++) {
            this.totalDebt += this.debts[i].debtValue;
        }
        return this.totalDebt;
    }

    totalMonthlyPaymentCalculator(_debts) {
        for (let i = 0; i < this.debts.length; i++) {
            this.totalMonthlyPayment += this.debts[i].minimumPayment;
        }
        return this.totalMonthlyPayment;
    }


  createDebt() {
    this.successMsg = '';
    this.errorMsg = '';
    this.debtService.createDebt(this.debtValue, this.interestRate, this.minimumPayment)
      .subscribe((createdDebt: Debt) => {
          this.debtValue = 0;
          this.interestRate = 0;
          this.minimumPayment = 0;
          this.totalDebt = 0;
          this.totalMonthlyPayment = 0;

          const debtValue = createdDebt.debtValue;
          //this.successMsg = `Debt added Successfully`;
          this.totalDebtCalculator(this.debts);
          this.totalMonthlyPaymentCalculator(this.debts);

        this.debtService.getDebts()
            .subscribe((debts: Debt[]) => {
              this.totalDebt = 0;
              this.totalMonthlyPayment = 0;
              this.debts = debts;
              this.loading = false;
              this.totalDebtCalculator(this.debts);
                this.totalMonthlyPaymentCalculator(this.debts);
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
        this.totalDebt = 0;
        this.totalMonthlyPayment = 0;

        this.debtService.cancelDebt(id)
       .pipe(
        mergeMap(() => this.debtService.getDebts())
       )
            .subscribe((debts: Debt[]) => {
            this.debts = debts;
            //this.successMsg = 'Successfully deleted debt';
            this.totalDebtCalculator(this.debts);
            this.totalMonthlyPaymentCalculator(this.debts);
      },
        (error: ErrorEvent) => {
          this.errorMsg = error.error.message;
        });
  }


 snackBar(message) {
    var x = document.getElementById("snackbar");
    x.className = "show";
    setTimeout(function () { x.className = x.className.replace("show", ""); }, 3000);
}
}

