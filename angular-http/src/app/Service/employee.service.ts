import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map } from 'rxjs/operators';
import { Subject, throwError } from 'rxjs';
import { Employee } from '../model/employee';

@Injectable({ providedIn: 'root' })
export class EmployeeService {
  
  //this Subject is going to emmit a string value, is working like an eventEmitter
  error = new Subject<string>();
  apiUrl = 'http://localhost:8083';

  constructor(private http: HttpClient) {}

  createEmployee(employee: { name: string; email: string; isManager: boolean}) {
    console.log(employee);

    this.http
      .post(
        `${this.apiUrl}/add-employee`,
        employee
      )
      .subscribe((response) => {
        console.log(response);
      }, (err) => {
        this.error.next(err.message);
      });
  }

  fetchEmployee() {

    return this.http
    .get<Employee[]>(`${this.apiUrl}/employees`)
    .pipe(
    catchError(err => {
      return throwError(err);
    })
  );
  }

  deleteEmployee(id: number) {

    this.http.delete(`${this.apiUrl}/delete-employee/${id}`)
    .subscribe();
  }

  updateEmployee(id: number, value: Employee){
    this.http.put(`${this.apiUrl}/update-employee/${id}`, value)
    .subscribe();
  }
}
