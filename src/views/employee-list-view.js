import { LitElement, html, css } from 'lit';
import '../components/table.js';

export class EmployeeListView extends LitElement {
  static properties = {
    employees: { type: Array },
    selectedEmployees: { type: Array },
    currentPage: { type: Number },
    pageSize: { type: Number },
    totalEmployees: { type: Number }
  };

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

    .header-right {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .employee-section {
      background: white;
      border-radius: 8px;
      padding: 24px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.05);
    }

    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
    }

    h1 {
      font-size: 24px;
      color: #333;
      margin: 0;
    }

    .view-toggle {
      display: flex;
      gap: 8px;
    }

    .view-toggle button {
      background: none;
      border: none;
      color: #666;
      cursor: pointer;
      font-size: 20px;
    }

    .view-toggle button:hover {
      color: #333;
    }

    .add-button {
      background: #ff6b00;
      color: white;
      border: none;
      padding: 8px 16px;
      border-radius: 4px;
      display: flex;
      align-items: center;
      gap: 8px;
      cursor: pointer;
      font-weight: 500;
    }

    .add-button:hover {
      background: #e65100;
    }

    .language-selector {
      padding: 6px 12px;
      border: 1px solid #ddd;
      border-radius: 4px;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    @media (max-width: 768px) {
      .header {
        flex-direction: column;
        gap: 16px;
      }

      .header-right {
        width: 100%;
        justify-content: space-between;
      }

      .employee-section {
        padding: 16px;
      }

      .section-header {
        flex-direction: column;
        gap: 16px;
        align-items: flex-start;
      }
    }
  `;

  constructor() {
    super();
    this.employees = [];
    this.selectedEmployees = [];
    this.currentPage = 1;
    this.pageSize = 10;
    this.totalEmployees = 0;
  }

  render() {
    return html`
      <div class="header">
        <div class="header-left">
          <div class="logo">ING</div>
          <h1>ING</h1>
        </div>
        <div class="header-right">
          <div>👥 Employees</div>
          <button class="add-button">
            <span>+</span>
            Add New
          </button>
          <div class="language-selector">
            🇹🇷 TR
          </div>
        </div>
      </div>

      <div class="employee-section">
        <div class="section-header">
          <h1>Employee List</h1>
          <div class="view-toggle">
            <button>☰</button>
            <button>⊞</button>
          </div>
        </div>

        <lit-table
          .columns=${this.getColumns()}
          .data=${this.getPaginatedData()}
          .actions=${this.getActions()}
          .selectable=${true}
          .page=${this.currentPage}
          .pageSize=${this.pageSize}
          .totalItems=${this.totalEmployees}
          @row-select=${this._handleRowSelect}
          @row-action=${this._handleRowAction}
          @page-change=${this._handlePageChange}
        ></lit-table>
      </div>
    `;
  }

  getColumns() {
    return [
      { field: 'firstName', header: 'First Name' },
      { field: 'lastName', header: 'Last Name' },
      { field: 'dateOfEmployment', header: 'Date of Employment' },
      { field: 'dateOfBirth', header: 'Date of Birth' },
      { 
        field: 'phone', 
        header: 'Phone',
        renderer: (value) => html`<a href="tel:${value}">${value}</a>`
      },
      { 
        field: 'email', 
        header: 'Email',
        renderer: (value) => html`<a href="mailto:${value}">${value}</a>`
      },
      { field: 'department', header: 'Department' },
      { field: 'position', header: 'Position' }
    ];
  }

  getActions() {
    return [
      { id: 'edit', label: 'Edit', icon: '✏️' },
      { id: 'delete', label: 'Delete', icon: '🗑️' }
    ];
  }

  getPaginatedData() {
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    return this.employees.slice(start, end);
  }

  _handleRowSelect(e) {
    this.selectedEmployees = e.detail.selectedItems;
    this.dispatchEvent(new CustomEvent('selection-change', {
      detail: { selectedEmployees: this.selectedEmployees }
    }));
  }

  _handleRowAction(e) {
    const { action, item } = e.detail;
    if (action === 'edit') {
      this.dispatchEvent(new CustomEvent('edit-employee', { detail: { employee: item } }));
    } else if (action === 'delete') {
      this.dispatchEvent(new CustomEvent('delete-employee', { detail: { employee: item } }));
    }
  }

  _handlePageChange(e) {
    this.currentPage = e.detail.page;
    this.requestUpdate();
  }
}

customElements.define('employee-list-view', EmployeeListView); 