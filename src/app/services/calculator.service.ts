import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Calculator } from '../models/calculator';
import { LoanResult } from '../models/loan-result';

@Injectable({
  providedIn: 'root',
})
export class CalculatorService {
  private readonly api = '/api/';

  private readonly httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'X-API-KEY': 'swb-222222',
    }),
  };

  constructor(private http: HttpClient) {}

  calculate(payload: Calculator): Observable<LoanResult> {
    return this.http.post<LoanResult>(this.api, payload, this.httpOptions);
  }
}
