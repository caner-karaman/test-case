import { fixture, html, assert } from '@open-wc/testing';
import '../../src/components/delete-confirmation.js';

suite('delete-confirmation', () => {
  test('is defined', () => {
    const el = document.createElement('delete-confirmation');
    assert.instanceOf(el, customElements.get('delete-confirmation'));
  });

  test('renders modal when open', async () => {
    const el = await fixture(html`
      <delete-confirmation
        .isOpen=${true}
        .employeeName=${'John Doe'}
      ></delete-confirmation>
    `);
    
    const modalTitle = el.shadowRoot.querySelector('.modal-title');
    assert.equal(modalTitle.textContent.trim(), 'Are you sure?');
    
    const modalContent = el.shadowRoot.querySelector('.modal-content');
    assert.include(modalContent.textContent, 'John Doe');
  });

  test('emits cancel event on cancel button click', async () => {
    const el = await fixture(html`
      <delete-confirmation
        .isOpen=${true}
        .employeeName=${'John Doe'}
      ></delete-confirmation>
    `);

    let cancelled = false;
    el.addEventListener('cancel', () => cancelled = true);

    const cancelBtn = el.shadowRoot.querySelector('.cancel-btn');
    cancelBtn.click();

    assert.isTrue(cancelled);
  });

  test('emits proceed event on proceed button click', async () => {
    const el = await fixture(html`
      <delete-confirmation
        .isOpen=${true}
        .employeeName=${'John Doe'}
      ></delete-confirmation>
    `);

    let proceeded = false;
    el.addEventListener('proceed', () => proceeded = true);

    const proceedBtn = el.shadowRoot.querySelector('.proceed-btn');
    proceedBtn.click();

    assert.isTrue(proceeded);
  });
}); 