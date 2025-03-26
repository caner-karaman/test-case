import { LitElement, html, css } from 'lit';

export class DeleteConfirmation extends LitElement {
  static properties = {
    isOpen: { type: Boolean },
    employeeName: { type: String }
  };

  static styles = css`
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(0, 0, 0, 0.5);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1000;
    }

    .modal {
      background: white;
      padding: 24px;
      border-radius: 8px;
      width: 400px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    }

    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
    }

    .modal-title {
      font-size: 1.25rem;
      font-weight: 600;
      color: #FF6200;
    }

    .close-button {
      background: none;
      border: none;
      font-size: 1.5rem;
      cursor: pointer;
      color: #666;
    }

    .modal-content {
      margin-bottom: 24px;
    }

    .modal-actions {
      display: flex;
      justify-content: flex-end;
      gap: 12px;
    }

    button {
      padding: 8px 16px;
      border-radius: 4px;
      border: none;
      cursor: pointer;
    }

    .cancel-btn {
      background-color: #f0f0f0;
      color: #333;
    }

    .proceed-btn {
      background-color: #FF6200;
      color: white;
    }
  `;

  constructor() {
    super();
    this.isOpen = false;
    this.employeeName = '';
  }

  render() {
    if (!this.isOpen) return null;

    return html`
      <div class="modal-overlay">
        <div class="modal">
          <div class="modal-header">
            <h2 class="modal-title">Are you sure?</h2>
            <button class="close-button" @click=${this._handleCancel}>&times;</button>
          </div>
          <div class="modal-content">
            Selected Employee record of ${this.employeeName} will be deleted
          </div>
          <div class="modal-actions">
            <button class="cancel-btn" @click=${this._handleCancel}>Cancel</button>
            <button class="proceed-btn" @click=${this._handleProceed}>Proceed</button>
          </div>
        </div>
      </div>
    `;
  }

  _handleCancel() {
    this.dispatchEvent(new CustomEvent('cancel'));
  }

  _handleProceed() {
    console.log('Delete proceed clicked');
    this.dispatchEvent(new CustomEvent('proceed', {
      bubbles: true,
      composed: true
    }));
  }
}

customElements.define('delete-confirmation', DeleteConfirmation); 