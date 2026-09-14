import { describe, expect, it } from 'vitest';
import { accessNameFromHost, validCompanyContext } from './companyAccess';
const env = { VITE_COMPANY_BASE_DOMAIN: 'red.example.com', DEV: false };
describe('REQ-ECO-003 host boundaries', () => {
  it('REQ-ECO-012 resolves tipo.click stores without accepting lookalike domains', () => {
    const production = { VITE_COMPANY_BASE_DOMAIN: 'tipo.click', DEV: false };
    expect(accessNameFromHost('m4.tipo.click', production)).toBe('m4');
    expect(accessNameFromHost('ramon-lopes.tipo.click', production)).toBe('ramon-lopes');
    expect(accessNameFromHost('a.tipo.click', production)).toBeNull();
    expect(accessNameFromHost('loja-a.tipo.click', production)).toBe('loja-a');
    expect(accessNameFromHost('loja-b.tipo.click', production)).toBe('loja-b');
    for (const host of ['tipo.click', 'loja-a.tipo.click.evil.org', 'loja-a.falsotipo.click', 'a.loja-a.tipo.click', 'api.tipo.click']) {
      expect(accessNameFromHost(host, production)).toBeNull();
    }
  });
  it('uses exactly one company label', () => {
    expect(accessNameFromHost('Loja-A.red.example.com', env)).toBe('loja-a');
  });
  it.each(['red.example.com', 'evilred.example.com', 'loja.red.example.com.evil.org', 'a.loja.red.example.com', 'api.red.example.com', 'loja--a.red.example.com', 'localhost'])('rejects %s', (host) => {
    expect(accessNameFromHost(host, env)).toBeNull();
  });
  it('requires explicit development override and ignores it in production', () => {
    expect(accessNameFromHost('localhost', { DEV: true })).toBeNull();
    expect(accessNameFromHost('localhost', { DEV: true, VITE_DEV_COMPANY_ACCESS_NAME: 'loja-a' })).toBe('loja-a');
    expect(accessNameFromHost('localhost', { DEV: false, VITE_DEV_COMPANY_ACCESS_NAME: 'loja-a' })).toBeNull();
  });
  it('rejects mismatched or incomplete public responses', () => {
    expect(validCompanyContext({ companyId: 'a', name: 'A', accessName: 'loja-b' }, 'loja-a')).toBe(false);
  });
});
