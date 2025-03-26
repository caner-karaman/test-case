import { fixture, html, assert } from '@open-wc/testing';
import '../../src/views/employee-list-view.js';

const sampleEmployees = [
  {
    id: '1',
    firstName: 'John',
    lastName: 'Doe',
    dateOfEmployment: '23/09/2022',
    dateOfBirth: '01/01/1990',
    phone: '5306626742',
    email: 'john@example.com',
    department: 'Analytics',
    position: 'Junior'
  }
];

suite('employee-list-view', () => {
  test('is defined', () => {
    const el = document.createElement('employee-list-view');
    assert.instanceOf(el, customElements.get('employee-list-view'));
  });

  test('initializes with default values', async () => {
    const el = await fixture(html`<employee-list-view></employee-list-view>`);
    assert.isArray(el.employees);
    assert.equal(el.currentPage, 1);
    assert.equal(el.pageSize, 10);
    assert.isNull(el.selectedEmployee);
    assert.isFalse(el.showDeleteModal);
  });

  test('renders employee table', async () => {
    const el = await fixture(html`
      <employee-list-view .employees=${sampleEmployees}></employee-list-view>
    `);
    const table = el.shadowRoot.querySelector('lit-table');
    assert.exists(table);
    assert.equal(table.data.length, sampleEmployees.length);
  });

  test('handles page change', async () => {
    const el = await fixture(html`<employee-list-view></employee-list-view>`);
    el._handlePageChange({ detail: { page: 2 } });
    assert.equal(el.currentPage, 2);
  });

  test('shows delete confirmation modal', async () => {
    const el = await fixture(html`<employee-list-view></employee-list-view>`);
    el.selectedEmployee = sampleEmployees[0];
    el.showDeleteModal = true;
    await el.updateComplete;

    const modal = el.shadowRoot.querySelector('delete-confirmation');
    assert.exists(modal);
    assert.equal(modal.employeeName, 'John Doe');
  });

  test('handles row action for edit', async () => {
    const el = await fixture(html`<employee-list-view></employee-list-view>`);
    let navigated = false;
    el.addEventListener('navigate', (e) => {
      navigated = true;
      assert.equal(e.detail.path, '/employee/edit/1');
    });

    el._handleRowAction({
      detail: { action: 'edit', item: sampleEmployees[0] }
    });

    assert.isFalse(navigated);
  });

  test('handles row action for delete', async () => {
    const el = await fixture(html`<employee-list-view></employee-list-view>`);
    el._handleRowAction({
      detail: { action: 'delete', item: sampleEmployees[0] }
    });

    assert.isTrue(el.showDeleteModal);
    assert.deepEqual(el.selectedEmployee, sampleEmployees[0]);
  });
}); 