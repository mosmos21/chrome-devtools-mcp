/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
import assert from 'node:assert';
import {describe, it} from 'node:test';

import {issueVaultToken, revokeVaultToken} from '../../src/tools/vault.js';
import {withBrowser} from '../utils.js';

describe('vault', () => {
  describe('issueVaultToken', () => {
    it('should issue a token successfully', async () => {
      await withBrowser(async (response, context) => {
        await issueVaultToken.handler(
          {
            params: {
              userId: 'test-user',
              expiresIn: 300,
            },
          },
          response,
          context,
        );

        assert.ok(
          response.responseLines.some(line =>
            line.includes('Token issued successfully'),
          ),
        );
        assert.ok(response.responseLines.some(line => line.includes('Token:')));
        assert.ok(
          response.responseLines.some(line => line.includes('Expires at:')),
        );
      });
    });

    it('should issue a token with default expiration', async () => {
      await withBrowser(async (response, context) => {
        await issueVaultToken.handler(
          {
            params: {
              userId: 'test-user',
            },
          },
          response,
          context,
        );

        assert.ok(
          response.responseLines.some(line =>
            line.includes('Token issued successfully'),
          ),
        );
      });
    });
  });

  describe('revokeVaultToken', () => {
    it('should revoke a token successfully', async () => {
      let issuedToken = '';

      // まず token を発行
      await withBrowser(async (response, context) => {
        await issueVaultToken.handler(
          {
            params: {
              userId: 'test-user',
            },
          },
          response,
          context,
        );

        const tokenLine = response.responseLines.find(line =>
          line.startsWith('Token:'),
        );
        assert.ok(tokenLine);
        issuedToken = tokenLine.split('Token:')[1].trim();
      });

      // token を破棄
      await withBrowser(async (response, context) => {
        await revokeVaultToken.handler(
          {
            params: {
              token: issuedToken,
            },
          },
          response,
          context,
        );

        assert.ok(
          response.responseLines.some(line =>
            line.includes('Token revoked successfully'),
          ),
        );
      });
    });
  });
});
