import { Component, OnInit } from '@angular/core';
import { Calculator } from 'src/app/models/calculator';
import { Children } from 'src/app/models/children';
import { CoApplicant } from 'src/app/models/coApplicant';
import { FieldErrors } from 'src/app/models/field-errors';
import { LoanResult } from 'src/app/models/loan-result';
import { CalculatorService } from 'src/app/services/calculator.service';

interface ChildStateChoice {
  value: Children;
  viewName: string;
}

interface CoApplicantChoice {
  value: CoApplicant;
  viewName: string;
}

@Component({
  selector: 'app-loan-calculator',
  templateUrl: './loan-calculator.component.html',
  styleUrls: ['./loan-calculator.component.scss'],
})
export class LoanCalculatorComponent implements OnInit {
  constructor(private calculatorService: CalculatorService) {}

  calculator = new Calculator();

  result?: LoanResult;

  errors = new FieldErrors();

  hiddenFractionalPart = 1000;

  childStateChoices: ChildStateChoice[] = [
    { value: Children.none, viewName: 'None' },
    { value: Children.single, viewName: 'Single' },
    { value: Children.multiple, viewName: 'Multiple' },
  ];

  coApplicantChoices: CoApplicantChoice[] = [
    { value: CoApplicant.none, viewName: 'None' },
    { value: CoApplicant.singleBorrower, viewName: 'Single borrower' },
    { value: CoApplicant.multipleBorrowers, viewName: 'Multiple borrowers' },
  ];

  ngOnInit(): void {}

  onIncomeInput(event: any) {
    this.calculator.monthlyIncome =
      event.target.value * this.hiddenFractionalPart;
  }

  onAmountInput(event: any) {
    this.calculator.requestedAmount =
      event.target.value * this.hiddenFractionalPart;
  }

  reset() {
    this.calculator = new Calculator();
    this.result = undefined;
    this.errors = new FieldErrors();
  }

  calculate() {
    this.calculator.monthlyIncome = Math.trunc(this.calculator.monthlyIncome);
    this.calculator.requestedAmount = Math.trunc(
      this.calculator.requestedAmount
    );
    this.errors = new FieldErrors();
    this.calculatorService.calculate(this.calculator).subscribe(
      (res: LoanResult) => {
        this.result = res;
      },
      (err) => {
        if (parseInt(err.status) === 400) {
          err.error.fields.map((e: { params: string; message: string | undefined; }) => {
            this.errors[e.params as keyof FieldErrors] = e.message;
          })
        }
      }
    );
  }
}
