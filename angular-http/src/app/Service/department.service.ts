import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { Subject, throwError } from 'rxjs';
import { Department } from '../model/department';

@Injectable({ providedIn: 'root' })
export class DepartmentService {
  
  //this Subject is going to emmit a string value, is working like an eventEmitter
  error = new Subject<string>();
  apiUrl = 'http://localhost:8083';

  constructor(private http: HttpClient) {

  }

  createDepartment(department: { name: string; description: string;}) {
    console.log(department);

    this.http
      .post(
        `${this.apiUrl}/add-department`,
        department
      )
      .subscribe((response) => {
        console.log(response);
      }, (err) => {
        this.error.next(err.message);
      });
  }

  fetchDepartment() {

    return this.http
    .get<Department[]>(`${this.apiUrl}/departments`)
    .pipe(
    catchError(err => {
      return throwError(err);
    })
    );
  }

  deleteDepartment(id: number) {

    this.http.delete(`${this.apiUrl}/delete-department/${id}`)
    .subscribe();
  }

  updateDepartment(id: number, value: Department){
    this.http.put(`${this.apiUrl}/update-department/${id}`, value)
    .subscribe();
  }
}
