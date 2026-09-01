#!/usr/bin/env node
/**
 * Encrypts exigier-overview.content.html into exigier-payload.js.
 *
 *   EXIGER_PASSWORD='your-password' node scripts/encrypt-exiger.mjs
 *
 * The password is never written to disk. Only salt, iv, and ciphertext are saved.
 */
import { pbkdf2Sync, randomBytes, createCipheriv } from 'node:crypto';
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const password = process.env.EXIGER_PASSWORD;
if (!password) {
    console.error('Set EXIGER_PASSWORD in the environment, then run this script.');
    process.exit(1);
}

const plaintext = readFileSync(join(root, 'exiger-overview.content.html'), 'utf8');
const iterations = 210000;
const salt = randomBytes(16);
const iv = randomBytes(12);
const key = pbkdf2Sync(password, salt, iterations, 32, 'sha256');
const cipher = createCipheriv('aes-256-gcm', key, iv);
const encrypted = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final()]);
const payload = {
    v: 1,
    iter: iterations,
    salt: salt.toString('base64'),
    iv: iv.toString('base64'),
    data: Buffer.concat([encrypted, cipher.getAuthTag()]).toString('base64')
};

writeFileSync(
    join(root, 'exiger-payload.js'),
    `window.EXIGER_PAYLOAD=${JSON.stringify(payload)};\n`
);
console.log('Wrote exigier-payload.js');
