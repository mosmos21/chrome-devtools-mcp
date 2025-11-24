/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {VaultKeyClient} from '@mosmos_21/vault-key-core';

import type {McpContext} from '../McpContext.js';
import {zod} from '../third_party/index.js';

import {ToolCategory} from './categories.js';
import {defineTool} from './ToolDefinition.js';

// VaultKey クライアントインスタンス (シングルトン)
let vaultKeyClient: VaultKeyClient | null = null;

/**
 * VaultKey クライアントを取得または初期化する
 */
const getVaultKeyClient = (): VaultKeyClient => {
  if (!vaultKeyClient) {
    vaultKeyClient = new VaultKeyClient();
  }
  return vaultKeyClient;
};

/**
 * VaultKey のエラーを適切なメッセージに変換する
 */
const handleVaultError = (error: unknown, context: string): never => {
  // 機密情報を含まない汎用的なエラーメッセージを返す
  if (error instanceof Error) {
    if (error.message.includes('token')) {
      throw new Error(`${context}: Invalid or expired token`);
    }
    if (error.message.includes('not found')) {
      throw new Error(`${context}: Secret not found`);
    }
  }
  throw new Error(`${context}: Operation failed`);
};

/**
 * フォーム要素に値を入力する (input.ts の fillFormElement から移植)
 */
async function fillFormElement(
  uid: string,
  value: string,
  context: McpContext,
) {
  const handle = await context.getElementByUid(uid);
  try {
    const aXNode = context.getAXNodeByUid(uid);
    if (aXNode && aXNode.role === 'combobox') {
      // combobox の場合はオプションを選択
      let optionFound = false;
      for (const child of aXNode.children) {
        if (child.role === 'option' && child.name === value && child.value) {
          optionFound = true;
          const childHandle = await child.elementHandle();
          if (childHandle) {
            try {
              const childValueHandle = await childHandle.getProperty('value');
              try {
                const childValue = await childValueHandle.jsonValue();
                if (childValue) {
                  await handle.asLocator().fill(childValue.toString());
                }
              } finally {
                void childValueHandle.dispose();
              }
              break;
            } finally {
              void childHandle.dispose();
            }
          }
        }
      }
      if (!optionFound) {
        throw new Error(`Could not find option with text "${value}"`);
      }
    } else {
      await handle.asLocator().fill(value);
    }
  } finally {
    void handle.dispose();
  }
}

export const issueVaultToken = defineTool({
  name: 'issue_vault_token',
  description: 'Issue a new token from VaultKey for accessing secret values',
  annotations: {
    category: ToolCategory.INPUT,
    readOnlyHint: false,
  },
  schema: {
    userId: zod.string().describe('The user ID to issue the token for'),
    expiresIn: zod
      .number()
      .optional()
      .describe('Token expiration time in seconds (optional, default: 300)'),
  },
  handler: async (request, response, _context) => {
    try {
      const client = getVaultKeyClient();
      const {userId, expiresIn} = request.params;

      // ユーザーが存在しない場合は登録する
      try {
        client.registerUser(userId);
      } catch {
        // ユーザーが既に存在する場合はエラーを無視
      }

      const result = client.issueToken(userId, expiresIn);
      response.appendResponseLine('Token issued successfully');
      response.appendResponseLine(`Token: ${result.token}`);
      response.appendResponseLine(`Expires at: ${result.expiresAt}`);
    } catch (error) {
      handleVaultError(error, 'Failed to issue token');
    }
  },
});

export const fillWithVault = defineTool({
  name: 'fill_with_vault',
  description:
    'Fill a form field with a secret value from VaultKey using token and valueKey',
  annotations: {
    category: ToolCategory.INPUT,
    readOnlyHint: false,
  },
  schema: {
    uid: zod
      .string()
      .describe(
        'The uid of an element on the page from the page content snapshot',
      ),
    token: zod.string().describe('The token obtained from issue_vault_token'),
    valueKey: zod
      .string()
      .describe('The key of the secret value stored in VaultKey'),
  },
  handler: async (request, response, context) => {
    try {
      const client = getVaultKeyClient();
      const {uid, token, valueKey} = request.params;

      // VaultKey から機密情報を取得
      const secretData = client.getSecret(valueKey, token);
      const secretValue = secretData.value;

      // 要素に入力
      await context.waitForEventsAfterAction(async () => {
        await fillFormElement(uid, secretValue, context as McpContext);
      });

      response.appendResponseLine('Successfully filled out the element');
      response.includeSnapshot();
    } catch (error) {
      handleVaultError(error, 'Failed to fill element with secret');
    }
  },
});

export const fillFormWithVault = defineTool({
  name: 'fill_form_with_vault',
  description: 'Fill multiple form fields with secret values from VaultKey',
  annotations: {
    category: ToolCategory.INPUT,
    readOnlyHint: false,
  },
  schema: {
    elements: zod
      .array(
        zod.object({
          uid: zod.string().describe('The uid of the element to fill out'),
          token: zod
            .string()
            .describe('The token for accessing the secret value'),
          valueKey: zod
            .string()
            .describe('The key of the secret value in VaultKey'),
        }),
      )
      .describe('Elements to fill with secret values'),
  },
  handler: async (request, response, context) => {
    try {
      const client = getVaultKeyClient();

      for (const element of request.params.elements) {
        const {uid, token, valueKey} = element;

        // VaultKey から機密情報を取得
        const secretData = client.getSecret(valueKey, token);
        const secretValue = secretData.value;

        // 要素に入力
        await context.waitForEventsAfterAction(async () => {
          await fillFormElement(uid, secretValue, context as McpContext);
        });
      }

      response.appendResponseLine('Successfully filled out the form');
      response.includeSnapshot();
    } catch (error) {
      handleVaultError(error, 'Failed to fill form with secrets');
    }
  },
});

export const handleBasicAuthWithVault = defineTool({
  name: 'handle_basic_auth_with_vault',
  description:
    'Handle HTTP Basic authentication with credentials from VaultKey',
  annotations: {
    category: ToolCategory.INPUT,
    readOnlyHint: false,
  },
  schema: {
    usernameToken: zod.string().describe('Token for accessing the username'),
    usernameValueKey: zod.string().describe('VaultKey key for the username'),
    passwordToken: zod.string().describe('Token for accessing the password'),
    passwordValueKey: zod.string().describe('VaultKey key for the password'),
  },
  handler: async (request, response, context) => {
    try {
      const client = getVaultKeyClient();
      const {usernameToken, usernameValueKey, passwordToken, passwordValueKey} =
        request.params;

      // VaultKey からユーザー名とパスワードを取得
      const usernameData = client.getSecret(usernameValueKey, usernameToken);
      const passwordData = client.getSecret(passwordValueKey, passwordToken);

      const username = usernameData.value;
      const password = passwordData.value;

      // Basic 認証を設定
      const page = context.getSelectedPage();
      await page.authenticate({
        username,
        password,
      });

      response.appendResponseLine(
        'Successfully configured HTTP Basic authentication',
      );
    } catch (error) {
      handleVaultError(error, 'Failed to handle Basic authentication');
    }
  },
});

export const revokeVaultToken = defineTool({
  name: 'revoke_vault_token',
  description: 'Revoke a VaultKey token to prevent further access',
  annotations: {
    category: ToolCategory.INPUT,
    readOnlyHint: false,
  },
  schema: {
    token: zod.string().describe('The token to revoke'),
  },
  handler: async (request, response, _context) => {
    try {
      const client = getVaultKeyClient();
      const {token} = request.params;
      client.revokeToken(token);
      response.appendResponseLine('Token revoked successfully');
    } catch (error) {
      handleVaultError(error, 'Failed to revoke token');
    }
  },
});
