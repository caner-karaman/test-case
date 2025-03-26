import { fixture, html, assert } from '@open-wc/testing';
import '../../src/components/employee-form.js';

suite('employee-form', () => {
  test('is defined', () => {
    const el = document.createElement('employee-form');
    assert.instanceOf(el, customElements.get('employee-form'));
  });

  test('initializes with default values', async () => {
    const el = await fixture(html`<employee-form></employee-form>`);
    assert.equal(el.mode, 'create');
    assert.isNull(el.employeeId);
    assert.deepEqual(el.errors, {});
    assert.isFalse(el.isSubmitting);
  });

  test('validates required fields', async () => {
    const el = await fixture(html`<employee-form></employee-form>`);
    const isValid = el._validateForm();
    assert.isFalse(isValid);
    assert.exists(el.errors.firstName);
    assert.exists(el.errors.lastName);
    assert.exists(el.errors.dateOfEmployment);
  });

  test('validates email format', async () => {
    const el = await fixture(html`<employee-form></employee-form>`);
    el.employee = {
      ...el.employee,
      email: 'invalid-email'
    };
    el._validateForm();
    assert.exists(el.errors.email);
  });

  test('validates phone number format', async () => {
    const el = await fixture(html`<employee-form></employee-form>`);
    el.employee = {
      ...el.employee,
      phone: '123'
    };
    el._validateForm();
    assert.exists(el.errors.phone);
  });

  test('validates department selection', async () => {
    const el = await fixture(html`<employee-form></employee-form>`);
    el.employee = {
      ...el.employee,
      department: 'Invalid Department'
    };
    el._validateForm();
    assert.exists(el.errors.department);
  });

  test('validates position selection', async () => {
    const el = await fixture(html`<employee-form></employee-form>`);
    el.employee = {
      ...el.employee,
      position: 'Invalid Position'
    };
    el._validateForm();
    assert.exists(el.errors.position);
  });

  test('validates employee age', async () => {
    const el = await fixture(html`<employee-form></employee-form>`);
    const currentYear = new Date().getFullYear();
    el.employee = {
      ...el.employee,
      dateOfBirth: `01/01/${currentYear-17}` // 17 years old
    };
    el._validateForm();
    assert.exists(el.errors.dateOfBirth);
  });
});