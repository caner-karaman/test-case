import { LitElement, html, css } from 'lit';

export class EmployeeForm extends LitElement {
  static properties = {
    employee: { type: Object },
    employeeId: { type: String },
    mode: { type: String },
    errors: { type: Object },
    isSubmitting: { type: Boolean }
  };

  constructor() {
    super();
    this.resetEmployee();
    this.employeeId = null;
    this.mode = 'create';
    this.errors = {};
    this.isSubmitting = false;
    this.departments = ['Analytics', 'Tech'];
    this.positions = ['Junior', 'Medior', 'Senior'];
  }

  resetEmployee() {
    this.employee = {
      firstName: '',
      lastName: '',
      dateOfEmployment: '',
      dateOfBirth: '',
      phone: '',
      email: '',
      department: '',
      position: ''
    };
  }

  static styles = css`
    :host {
      display: block;
      padding: 20px;
      background-color: #f8f9fa;
      min-height: 100vh;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
    }

    .header-left {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .logo {
      width: 40px;
      height: 40px;
      background: #ff6b00;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-weight: bold;
    }

    .form-container {
      max-width: 600px;
      margin: 0 auto;
      background: white;
      padding: 24px;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.05);
    }

    .form-title {
      margin: 0 0 24px 0;
      font-size: 24px;
      color: #333;
    }

    .form-group {
      margin-bottom: 20px;
    }

    label {
      display: block;
      margin-bottom: 8px;
      color: #333;
      font-weight: 500;
    }

    input, select {
      width: 100%;
      padding: 8px 12px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 14px;
      box-sizing: border-box;
    }

    input:focus, select:focus {
      outline: none;
      border-color: #ff6b00;
    }

    .error {
      color: #dc3545;
      font-size: 12px;
      margin-top: 4px;
    }

    .actions {
      display: flex;
      justify-content: flex-end;
      gap: 12px;
      margin-top: 24px;
    }

    button {
      padding: 10px 20px;
      border-radius: 4px;
      border: none;
      font-weight: 500;
      cursor: pointer;
    }

    button:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }

    .cancel-btn {
      background: #f8f9fa;
      color: #333;
    }

    .submit-btn {
      background: #ff6b00;
      color: white;
    }

    .submit-btn:hover:not(:disabled) {
      background: #e65100;
    }

    @media (max-width: 768px) {
      .form-container {
        padding: 16px;
      }
    }
  `;

  updated(changedProperties) {
    super.updated(changedProperties);
  }

  render() {
    return html`
      <div class="header">
        <div class="header-left">
          <div class="logo">ING</div>
          <h1>ING</h1>
        </div>
      </div>

      <div class="form-container">
        <h2 class="form-title">${this.mode === 'edit' ? 'Edit' : 'Create'} Employee</h2>
        
        <form @submit=${this._handleSubmit}>
          <div class="form-group">
            <label for="firstName">First Name *</label>
            <input 
              type="text" 
              id="firstName"
              name="firstName"
              .value=${this.employee.firstName || ''}
              @input=${this._handleInput}
              ?disabled=${this.isSubmitting}
              required
            >
            ${this.errors.firstName ? html`
              <div class="error">${this.errors.firstName}</div>
            ` : ''}
          </div>

          <div class="form-group">
            <label for="lastName">Last Name *</label>
            <input 
              type="text" 
              id="lastName"
              name="lastName"
              .value=${this.employee.lastName || ''}
              @input=${this._handleInput}
              ?disabled=${this.isSubmitting}
              required
            >
            ${this.errors.lastName ? html`
              <div class="error">${this.errors.lastName}</div>
            ` : ''}
          </div>

          <div class="form-group">
            <label for="dateOfEmployment">Date of Employment</label>
            <input 
              type="date" 
              id="dateOfEmployment"
              name="dateOfEmployment"
              .value=${this._formatDateForInput(this.employee.dateOfEmployment)}
              @input=${this._handleInput}
              ?disabled=${this.isSubmitting}
            >
            ${this.errors.dateOfEmployment ? html`<div class="error">${this.errors.dateOfEmployment}</div>` : ''}
          </div>

          <div class="form-group">
            <label for="dateOfBirth">Date of Birth</label>
            <input 
              type="date" 
              id="dateOfBirth"
              name="dateOfBirth"
              .value=${this._formatDateForInput(this.employee.dateOfBirth)}
              @input=${this._handleInput}
              ?disabled=${this.isSubmitting}
            >
            ${this.errors.dateOfBirth ? html`<div class="error">${this.errors.dateOfBirth}</div>` : ''}
          </div>

          <div class="form-group">
            <label for="phone">Phone Number *</label>
            <input 
              type="tel" 
              id="phone"
              name="phone"
              .value=${this.employee.phone || ''}
              @input=${this._handleInput}
              placeholder="5306626742"
              maxlength="10"
              pattern="[0-9]{10}"
              ?disabled=${this.isSubmitting}
              required
            >
            ${this.errors.phone ? html`
              <div class="error">${this.errors.phone}</div>
            ` : ''}
          </div>

          <div class="form-group">
            <label for="email">Email Address *</label>
            <input 
              type="email" 
              id="email"
              name="email"
              .value=${this.employee.email || ''}
              @input=${this._handleInput}
              ?disabled=${this.isSubmitting}
              required
            >
            ${this.errors.email ? html`
              <div class="error">${this.errors.email}</div>
            ` : ''}
          </div>

          <div class="form-group">
            <label for="department">Department</label>
            <select 
              id="department"
              name="department"
              .value=${this.employee.department || ''}
              @change=${this._handleInput}
              ?disabled=${this.isSubmitting}
            >
              <option value="">Select Department</option>
              ${this.departments.map(dept => html`
                <option 
                  value=${dept}
                  ?selected=${dept === this.employee.department}
                >${dept}</option>
              `)}
            </select>
            ${this.errors.department ? html`<div class="error">${this.errors.department}</div>` : ''}
          </div>

          <div class="form-group">
            <label for="position">Position</label>
            <select 
              id="position"
              name="position"
              .value=${this.employee.position || ''}
              @change=${this._handleInput}
              ?disabled=${this.isSubmitting}
            >
              <option value="">Select Position</option>
              ${this.positions.map(pos => html`
                <option 
                  value=${pos}
                  ?selected=${pos === this.employee.position}
                >${pos}</option>
              `)}
            </select>
            ${this.errors.position ? html`<div class="error">${this.errors.position}</div>` : ''}
          </div>

          <div class="actions">
            <button 
              type="button" 
              class="cancel-btn"
              @click=${this._handleCancel}
              ?disabled=${this.isSubmitting}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              class="submit-btn"
              ?disabled=${this.isSubmitting}
            >
              ${this.isSubmitting ? 
                (this.mode === 'edit' ? 'Updating...' : 'Creating...') : 
                (this.mode === 'edit' ? 'Update Employee' : 'Create Employee')}
            </button>
          </div>
        </form>
      </div>
    `;
  }

  _formatDateForInput(dateString) {
    if (!dateString) return '';
    const [day, month, year] = dateString.split('/');
    return `${year}-${month}-${day}`;
  }

  _formatDateForStorage(dateString) {
    if (!dateString) return '';
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year}`;
  }

  _handleInput(e) {
    const { name, value } = e.target;
    if (name === 'dateOfEmployment' || name === 'dateOfBirth') {
      this.employee = {
        ...this.employee,
        [name]: this._formatDateForStorage(value)
      };
    } else {
      this.employee = {
        ...this.employee,
        [name]: value
      };
    }

    if (this.errors[name]) {
      this.errors = {
        ...this.errors,
        [name]: ''
      };
    }
  }

  _validateForm() {
    const errors = {};

    if (this.employee.firstName.length < 2) {
      errors.firstName = 'First name must be at least 2 characters';
    }
    if (this.employee.lastName.length < 2) {
      errors.lastName = 'Last name must be at least 2 characters';
    }
    if (!this.employee.dateOfEmployment) {
      errors.dateOfEmployment = 'Employment date is required';
    }
    const birthDate = new Date(this.employee.dateOfBirth);
    const age = new Date().getFullYear() - birthDate.getFullYear();
    if (age < 18) {
      errors.dateOfBirth = 'Employee must be at least 18 years old';
    }
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(this.employee.phone)) {
      errors.phone = 'Phone number must be 10 digits (e.g., 5306626742)';
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.employee.email)) {
      errors.email = 'Please enter a valid email address';
    }
    if (!this.departments.includes(this.employee.department)) {
      errors.department = 'Please select a valid department';
    }
    if (!this.positions.includes(this.employee.position)) {
      errors.position = 'Please select a valid position';
    }

    this.errors = errors;
    return Object.keys(errors).length === 0;
  }

  _handleCancel() {
    this.dispatchEvent(new CustomEvent('navigate', {
      detail: { path: '/' },
      bubbles: true,
      composed: true
    }));
  }

  async _handleSubmit(e) {
    e.preventDefault();

    if (!this._validateForm()) return;

    this.isSubmitting = true;
    try {
      const eventName = this.mode === 'edit' ? 'employee-updated' : 'employee-created';
      
      const employeeData = {
        ...this.employee,
        id: this.employeeId
      };

      this.dispatchEvent(new CustomEvent(eventName, {
        detail: {
          employee: employeeData,
          employeeId: this.employeeId
        },
        bubbles: true,
        composed: true
      }));

      this.dispatchEvent(new CustomEvent('navigate', {
        detail: { path: '/' },
        bubbles: true,
        composed: true
      }));

    } catch (error) {
      console.error('Error submitting form:', error);
      this.errors = {
        ...this.errors,
        submit: `Failed to ${this.mode === 'edit' ? 'update' : 'create'} employee`
      };
    } finally {
      this.isSubmitting = false;
    }
  }
}

customElements.define('employee-form', EmployeeForm); 