import { Component, OnInit } from '@angular/core';
import { DebtsService } from '../debts.service';
import { Debt } from '../debts-model';
import { mergeMap } from 'rxjs/operators';

@Component({
  selector: 'app-debt-list',
  templateUrl: './debt-list.component.html',
  styleUrls: ['./debt-list.component.css']
})
export class DebtListComponent implements OnInit {

  public loading = true;
  public errorMsg: string;
  public successMsg: string;
  public debts: Debt[];
  public columns = ['appointmentDate', 'name', 'email', 'cancel'];

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

  cancelDebts(id: string) {
    this.debtService.cancelDebt(id)
      .pipe(
        mergeMap(() => this.debtService.getDebts())
      )
      .subscribe((debts: Debt[]) => {
        this.debts = debts;
        this.successMsg = 'Successfully cancelled appointment';
      },
        (error: ErrorEvent) => {
          this.errorMsg = error.error.message;
        });
  }

}
