import { describe, expect, it } from 'vitest';
import { MIN_PASSWORD_LENGTH, validateRegistration, type RegisterValues } from './validation';

const valid: RegisterValues = {
  name: 'Yusuf',
  email: 'yusuf@example.com',
  phone: '081234567890',
  password: 'secret1',
  confirmPassword: 'secret1',
};

const check = (overrides: Partial<RegisterValues>) =>
  validateRegistration({ ...valid, ...overrides });

describe('validateRegistration', () => {
  it('accepts a complete, valid form', () => {
    expect(check({})).toEqual({});
  });

  it('requires every field', () => {
    const errors = validateRegistration({
      name: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
    });
    expect(Object.keys(errors).sort()).toEqual(
      ['confirmPassword', 'email', 'name', 'password', 'phone']
    );
  });

  it('treats whitespace-only text as empty', () => {
    expect(check({ name: '   ' }).name).toBe('Name is required.');
    expect(check({ phone: ' ' }).phone).toBe('Phone number is required.');
    expect(check({ email: '  ' }).email).toBe('Email is required.');
  });

  it.each(['plain', 'no@tld', '@example.com', 'two@@example.com', 'space in@example.com'])(
    'rejects the invalid email %j',
    (email) => {
      expect(check({ email }).email).toBe('Enter a valid email address.');
    }
  );

  it.each(['a@b.co', 'first.last+tag@sub.example.org', '  padded@example.com  '])(
    'accepts the email %j',
    (email) => {
      expect(check({ email }).email).toBeUndefined();
    }
  );

  it(`requires at least ${MIN_PASSWORD_LENGTH} characters, matching the backend rule`, () => {
    expect(check({ password: '12345', confirmPassword: '12345' }).password).toBe(
      'Password must be at least 6 characters.'
    );
    expect(check({ password: '123456', confirmPassword: '123456' }).password).toBeUndefined();
  });

  it('flags a confirmation that does not match, but not when the password is what is wrong', () => {
    expect(check({ confirmPassword: 'different' }).confirmPassword).toBe(
      'Passwords do not match.'
    );
    expect(check({ password: 'abc', confirmPassword: 'abc' }).confirmPassword).toBeUndefined();
  });
});
