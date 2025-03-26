import { fixture, html, assert } from '@open-wc/testing';
import '../../src/components/table.js';

const sampleColumns = [
  { field: 'firstName', header: 'First Name' },
  { field: 'lastName', header: 'Last Name' },
  { field: 'email', header: 'Email' }
];

const sampleData = [
  {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com'
  }
];

const sampleActions = [
  { id: 'edit', label: 'Edit', icon: '✏️' },
  { id: 'delete', label: 'Delete', icon: '🗑️' }
];

suite('lit-table', () => {
  test('is defined', () => {
    const el = document.createElement('lit-table');
    assert.instanceOf(el, customElements.get('lit-table'));
  });

  test('renders with empty data', async () => {
    const el = await fixture(html`
      <lit-table .columns=${sampleColumns}></lit-table>
    `);
    
    const headers = el.shadowRoot.querySelectorAll('th');
    assert.equal(headers.length, sampleColumns.length);
    assert.equal(headers[0].textContent.trim(), 'First Name');
  });

  test('renders with data', async () => {
    const el = await fixture(html`
      <lit-table 
        .columns=${sampleColumns}
        .data=${sampleData}
      ></lit-table>
    `);
    
    const cells = el.shadowRoot.querySelectorAll('td');
    assert.equal(cells[0].textContent.trim(), 'John');
    assert.equal(cells[1].textContent.trim(), 'Doe');
  });

  test('handles custom renderer', async () => {
    const columnsWithRenderer = [
      ...sampleColumns,
      {
        field: 'email',
        header: 'Email',
        renderer: (value) => html`<a href="mailto:${value}">${value}</a>`
      }
    ];

    const el = await fixture(html`
      <lit-table 
        .columns=${columnsWithRenderer}
        .data=${sampleData}
      ></lit-table>
    `);
    
    const emailCell = el.shadowRoot.querySelector('td:last-child');
    const link = emailCell.querySelector('a');
    assert.exists(link);
    assert.equal(link.href, 'mailto:john@example.com');
  });

  test('handles row selection', async () => {
    const el = await fixture(html`
      <lit-table 
        .columns=${sampleColumns}
        .data=${sampleData}
        .selectable=${true}
      ></lit-table>
    `);

    let selectEventFired = false;
    el.addEventListener('row-select', (e) => {
      selectEventFired = true;
      assert.deepEqual(e.detail.selectedItems, [sampleData[0]]);
    });

    const checkbox = el.shadowRoot.querySelector('tbody input[type="checkbox"]');
    checkbox.click();
    
    assert.isTrue(selectEventFired);
  });

  test('handles actions', async () => {
    const el = await fixture(html`
      <lit-table 
        .columns=${sampleColumns}
        .data=${sampleData}
        .actions=${sampleActions}
      ></lit-table>
    `);

    let actionEventFired = false;
    el.addEventListener('row-action', (e) => {
      actionEventFired = true;
      assert.equal(e.detail.action, 'edit');
      assert.deepEqual(e.detail.item, sampleData[0]);
    });

    const editButton = el.shadowRoot.querySelector('.action-btn');
    editButton.click();
    
    assert.isTrue(actionEventFired);
  });
}); 