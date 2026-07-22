import { validateEnvironment } from './environment.schema';

const validEnvironment = {
  PORT: '3333',
  SUPABASE_URL: 'https://example.supabase.co',
  SUPABASE_ANON_KEY: 'anon-key',
  SUPABASE_SERVICE_ROLE_KEY: 'service-role-secret',
  DATABASE_URL: 'postgresql://user:password@host:6543/postgres',
  DIRECT_URL: 'postgresql://user:password@host:5432/postgres',
  REDIS_URL: 'redis://localhost:6379',
};

describe('validateEnvironment', () => {
  it('parses valid configuration and coerces the port', () => {
    expect(validateEnvironment(validEnvironment)).toMatchObject({
      ...validEnvironment,
      PORT: 3333,
    });
  });

  it('uses port 3333 by default', () => {
    const withoutPort: Record<string, string> = { ...validEnvironment };
    delete withoutPort.PORT;

    expect(validateEnvironment(withoutPort).PORT).toBe(3333);
  });

  it.each(['SUPABASE_URL', 'DATABASE_URL', 'REDIS_URL'])(
    'rejects an invalid %s URL without leaking its value',
    (key) => {
      const invalidValue = 'not-a-secret-url';

      expect(() =>
        validateEnvironment({ ...validEnvironment, [key]: invalidValue }),
      ).toThrow(key);
      expect(() =>
        validateEnvironment({ ...validEnvironment, [key]: invalidValue }),
      ).not.toThrow(invalidValue);
    },
  );

  it('names missing keys without leaking configured secrets', () => {
    const missingSecret: Record<string, string> = { ...validEnvironment };
    delete missingSecret.SUPABASE_SERVICE_ROLE_KEY;

    expect(() => validateEnvironment(missingSecret)).toThrow(
      'SUPABASE_SERVICE_ROLE_KEY',
    );
    expect(() => validateEnvironment(missingSecret)).not.toThrow(
      validEnvironment.DATABASE_URL,
    );
  });
});
