import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { HttpClient} from '@angular/common/http'
import { DepartmentService } from './Service/department.service';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Department } from './model/department';
import { Employee} from './model/employee';
import { EmployeeService } from './Service/employee.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {

  title = 'angular-http';

  private http !: HttpClient ;
  private departmentService !: DepartmentService;
  private employeeService !: EmployeeService;

  allDeparments : Department[] = [];
  allEmployees: Employee[] = [];

  isFetching : boolean = false;
  errorMessage: string = null;
  errorSub: Subscription;

  currentDepartmentId: number;
  currentEmployeeId: number;

  @ViewChild('departmentsForm') departmentsForm: NgForm;
  @ViewChild('employeeForm') employeeForm: NgForm;

  editMode: boolean = false;

  constructor(http: HttpClient,departmentService: DepartmentService, employeeService: EmployeeService){
    this.http = http;
    this.departmentService = departmentService;
    this.employeeService = employeeService;
  }

  ngOnInit(){

    this.fetchDepartments();
    this.errorSub = this.departmentService.error.subscribe((message) => {
      this.errorMessage = message;
    })

    this.fetchEmployees();
    this.errorSub = this.employeeService.error.subscribe((message) => {
      this.errorMessage = message;
    })
  }

  onDepartmentsFetch(){
    this.fetchDepartments();
  }

  onDepartmentCreate(department: {description: string, name: string}){
    if(this.editMode){
      this.departmentService.updateDepartment(this.currentDepartmentId, department)
    }
    else{
      this.departmentService.createDepartment(department);
    }
    console.log(this.departmentsForm)
  }

  private fetchDepartments(){
    this.isFetching = true;
    this.departmentService.fetchDepartment().subscribe((departments) => {
      this.allDeparments = departments;
      this.isFetching = false;

    },(err) => {
      this.errorMessage = err.message;
    })
  }

  onDeleteDepartment(id: number){
    this.departmentService.deleteDepartment(id);
  }

  onEditClickedDepartment(id: number){

    this.currentDepartmentId = id;
    let currentDepartment= this.allDeparments.find((department) => {
      return department.id === id;
    })
    
    //Populate the form with details
    this.departmentsForm.setValue({
      name: currentDepartment.name,
      description:  currentDepartment.description,
    });

    this.editMode = true;
  }

  ngOnDestroy(): void {
    this.errorSub.unsubscribe();
  }


  onEmployeeFetch(){
    this.fetchEmployees();
  }

  onEmployeeCreate(employee: { name: string; email: string; isManager: boolean}){
    if(this.editMode){
      this.employeeService.updateEmployee(this.currentEmployeeId, employee)
    }
    else{
      this.employeeService.createEmployee(employee);
    }
    
  }

  private fetchEmployees(){
    this.isFetching = true;
    this.employeeService.fetchEmployee().subscribe((employees) => {
      this.allEmployees = employees;
      this.isFetching = false;

    },(err) => {
      this.errorMessage = err.message;
    })
  }

  onDeleteEmployee(id: number){
    this.employeeService.deleteEmployee(id);
  }

  onEditClickedEmployee(id: number){

    this.currentEmployeeId = id;
    let currentEmployee = this.allEmployees.find((employee) => {
      return employee.id === id;
    })
    
    //Populate the form with details
    this.employeeForm.setValue({
      name: currentEmployee.name,
      email:  currentEmployee.email,
      isManager: currentEmployee.isManager,
    });

    this.editMode = true;
  }

}
