import { LitElement, html, css } from 'lit';

export class Table extends LitElement {
  static properties = {
    columns: { type: Array },
    data: { type: Array },
    selectable: { type: Boolean },
    selectedItems: { type: Array },
    actions: { type: Array },
    page: { type: Number },
    pageSize: { type: Number },
    totalItems: { type: Number }
  };

  static styles = css`
    :host {
      display: block;
      overflow-x: auto;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      min-width: 800px;
      background: #fff;
    }

    th, td {
      padding: 12px;
      text-align: left;
      border-bottom: 1px solid #eee;
    }

    th {
      background-color: #f8f9fa;
      font-weight: 600;
      white-space: nowrap;
    }

    tr:hover {
      background-color: #f5f5f5;
    }

    .actions {
      display: flex;
      gap: 8px;
    }

    .action-btn {
      cursor: pointer;
      padding: 4px;
      color: #666;
    }

    .action-btn:hover {
      color: #333;
    }

    .checkbox-cell {
      width: 40px;
      text-align: center;
    }

    @media (max-width: 768px) {
      table {
        font-size: 14px;
      }
      
      th, td {
        padding: 8px;
      }
    }

    .pagination {
      display: flex;
      align-items: center;
      justify-content: center;
      margin-top: 20px;
      gap: 8px;
    }

    .pagination button {
      padding: 8px 12px;
      border: none;
      background: none;
      cursor: pointer;
      color: #666;
      border-radius: 4px;
    }

    .pagination button:hover {
      background: #f5f5f5;
    }

    .pagination button.active {
      background: #ff6b00;
      color: white;
    }

    .pagination button:disabled {
      cursor: not-allowed;
      opacity: 0.5;
    }

    .pagination-ellipsis {
      color: #666;
    }
  `;

  constructor() {
    super();
    this.columns = [];
    this.data = [];
    this.selectable = false;
    this.selectedItems = [];
    this.actions = [];
    this.page = 1;
    this.pageSize = 10;
    this.totalItems = 0;
  }

  render() {
    return html`
      <table>
        <thead>
          <tr>
            ${this.selectable ? html`
              <th class="checkbox-cell">
                <input 
                  type="checkbox" 
                  @change=${this._handleSelectAll}
                  .checked=${this._areAllSelected()}
                >
              </th>
            ` : ''}
            ${this.columns.map(column => html`
              <th style=${column.width ? `width: ${column.width}` : ''}>
                ${column.header}
              </th>
            `)}
            ${this.actions.length ? html`<th>Actions</th>` : ''}
          </tr>
        </thead>
        <tbody>
          ${this.data.map(item => this._renderRow(item))}
        </tbody>
      </table>
      ${this._renderPagination()}
    `;
  }

  _renderRow(item) {
    return html`
      <tr>
        ${this.selectable ? html`
          <td class="checkbox-cell">
            <input 
              type="checkbox"
              .checked=${this._isSelected(item)}
              @change=${(e) => this._handleSelect(e, item)}
            >
          </td>
        ` : ''}
        ${this.columns.map(column => html`
          <td>
            ${column.renderer 
              ? column.renderer(item[column.field], item) 
              : item[column.field]}
          </td>
        `)}
        ${this.actions.length ? html`
          <td class="actions">
            ${this.actions.map(action => html`
              <span 
                class="action-btn"
                @click=${() => this._handleAction(action, item)}
                title=${action.label}
              >
                ${action.icon}
              </span>
            `)}
          </td>
        ` : ''}
      </tr>
    `;
  }

  _handleSelectAll(e) {
    const checked = e.target.checked;
    this.selectedItems = checked ? [...this.data] : [];
    this._dispatchSelectEvent();
  }

  _handleSelect(e, item) {
    const checked = e.target.checked;
    if (checked) {
      this.selectedItems = [...this.selectedItems, item];
    } else {
      this.selectedItems = this.selectedItems.filter(i => i !== item);
    }
    this._dispatchSelectEvent();
  }

  _isSelected(item) {
    return this.selectedItems.includes(item);
  }

  _areAllSelected() {
    return this.data.length > 0 && 
           this.selectedItems.length === this.data.length;
  }

  _handleAction(action, item) {
    this.dispatchEvent(new CustomEvent('row-action', {
      detail: { action: action.id, item },
      bubbles: true,
      composed: true
    }));
  }

  _dispatchSelectEvent() {
    this.dispatchEvent(new CustomEvent('row-select', {
      detail: { selectedItems: this.selectedItems },
      bubbles: true,
      composed: true
    }));
  }

  _renderPagination() {
    const totalPages = Math.ceil(this.totalItems / this.pageSize);
    const pages = this._getPageNumbers(totalPages);

    return html`
      <div class="pagination">
        <button 
          @click=${() => this._onPageChange(this.page - 1)}
          ?disabled=${this.page === 1}
        >
          ←
        </button>
        
        ${pages.map(pageNum => {
          if (pageNum === '...') {
            return html`<span class="pagination-ellipsis">...</span>`;
          }
          return html`
            <button
              class=${pageNum === this.page ? 'active' : ''}
              @click=${() => this._onPageChange(pageNum)}
            >
              ${pageNum}
            </button>
          `;
        })}

        <button 
          @click=${() => this._onPageChange(this.page + 1)}
          ?disabled=${this.page === totalPages}
        >
          →
        </button>
      </div>
    `;
  }

  _getPageNumbers(totalPages) {
    const pages = [];
    const currentPage = this.page;

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 5; i++) {
          pages.push(i);
        }
        pages.push('...', totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, '...');
        for (let i = totalPages - 4; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1, '...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push('...', totalPages);
      }
    }

    return pages;
  }

  _onPageChange(newPage) {
    this.dispatchEvent(new CustomEvent('page-change', {
      detail: { page: newPage },
      bubbles: true,
      composed: true
    }));
  }
}

customElements.define('lit-table', Table); 