import { createContext } from '@lit/context';
import { v4 as uuidv4 } from 'uuid';

export const employeeContext = createContext('employee-context');

export class EmployeeController {
  constructor() {
    this.state = {
      employees: Array(9).fill(null).map(() => ({
        id: uuidv4(),
        firstName: 'Ahmet',
        lastName: 'Sourtimes',
        dateOfEmployment: '23/09/2022',
        dateOfBirth: '23/09/2022',
        phone: '5306626742',
        email: 'ahmet@sourtimes.org',
        department: 'Analytics',
        position: 'Junior'
      })),
      currentPage: 1,
      pageSize: 10
    };
  }

  addEmployee(employee) {
    const newEmployee = {
      ...employee,
      id: uuidv4()
    };
    this.state.employees = [...this.state.employees, newEmployee];
  }

  updateEmployee(employeeId, updatedEmployee) {
    this.state.employees = this.state.employees.map(emp => {
      if (emp.id === employeeId) {
        return {
          ...emp,           
          ...updatedEmployee,
          id: employeeId
        };
      }
      return emp;
    });

    console.log('Updated employees:', this.state.employees);
    
    document.dispatchEvent(new CustomEvent('employees-state-changed', {
      detail: { employees: this.state.employees }
    }));
  }

  getEmployee(id) {
    const employee = this.state.employees.find(emp => emp.id === id);
    return employee;
  }

  deleteEmployee(employeeId) {
    this.state.employees = this.state.employees.filter(emp => emp.id !== employeeId);

    document.dispatchEvent(new CustomEvent('employees-state-changed', {
      detail: { employees: this.state.employees }
    }));
  }
} 