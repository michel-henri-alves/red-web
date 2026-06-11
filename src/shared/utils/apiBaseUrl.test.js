import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import axiosClient, { resolveApiBaseURL } from './apiBaseUrl';

const originalAdapter = axiosClient.defaults.adapter;

describe('axiosClient auth session handling', () => {
    beforeEach(() => {
        localStorage.clear();
    });

    afterEach(() => {
        axiosClient.defaults.adapter = originalAdapter;
        localStorage.clear();
    });

    it('replaces the stored bearer token with X-Access-Token from authenticated responses', async () => {
        localStorage.setItem('token', 'old-token');
        localStorage.setItem('authLastActivityAt', String(Date.now()));
        localStorage.setItem('user', JSON.stringify({
            id: 'user-1',
            name: 'Michel',
            tenantId: 'tenant-1',
        }));

        axiosClient.defaults.adapter = async (config) => ({
            config,
            data: {},
            headers: { 'x-access-token': 'new-token' },
            request: {},
            status: 200,
            statusText: 'OK',
        });

        await axiosClient.get('/users');

        expect(localStorage.getItem('token')).toBe('new-token');
        expect(Number(localStorage.getItem('authLastActivityAt'))).toBeGreaterThan(0);
    });

    it('does not send unused custom tenant or username headers', async () => {
        localStorage.setItem('token', 'token-123');
        localStorage.setItem('authLastActivityAt', String(Date.now()));
        localStorage.setItem('user', JSON.stringify({
            id: 'user-1',
            name: 'Michel',
            tenantId: 'tenant-1',
        }));

        let requestHeaders;
        axiosClient.defaults.adapter = async (config) => {
            requestHeaders = config.headers;
            return {
                config,
                data: {},
                headers: {},
                request: {},
                status: 200,
                statusText: 'OK',
            };
        };

        await axiosClient.get('/users');

        expect(requestHeaders.Authorization).toBe('Bearer token-123');
        expect(requestHeaders['x-tenant-id']).toBeUndefined();
        expect(requestHeaders['x-username']).toBeUndefined();
    });

    it('allows login requests without a stored token', async () => {
        let requestHeaders;
        axiosClient.defaults.adapter = async (config) => {
            requestHeaders = config.headers;
            return {
                config,
                data: {},
                headers: {},
                request: {},
                status: 200,
                statusText: 'OK',
            };
        };

        await axiosClient.post('/users/login', { email: 'user@example.com', password: 'password123' });

        expect(requestHeaders.Authorization).toBeUndefined();
    });

    it('cancels private requests when no stored token exists', async () => {
        let adapterCalled = false;
        axiosClient.defaults.adapter = async (config) => {
            adapterCalled = true;
            return {
                config,
                data: {},
                headers: {},
                request: {},
                status: 200,
                statusText: 'OK',
            };
        };

        await expect(axiosClient.get('/dashboard/sales/total-today')).rejects.toMatchObject({
            message: 'Authentication required',
        });

        expect(adapterCalled).toBe(false);
    });

    it('uses the configured API base URL for production builds', () => {
        expect(resolveApiBaseURL({
            DEV: false,
            VITE_API_BASE_URL: 'https://api.example.com',
        })).toBe('https://api.example.com');
    });

    it('requires an explicit API base URL', () => {
        expect(() => resolveApiBaseURL({ DEV: false })).toThrow(
            'VITE_API_BASE_URL is required.'
        );
    });
});
