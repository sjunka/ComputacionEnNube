import { expect, test } from 'vitest'
import { resolve, resolveDeep } from './placeholders'

test('usa el valor de la env o la etiqueta', () => {
  expect(resolve('cuenta {{ACCOUNT_ID}}', { VITE_ACCOUNT_ID: 'CUENTA-X' })).toBe('cuenta CUENTA-X')
  expect(resolve('cuenta {{ACCOUNT_ID}}', {})).toBe('cuenta ‹tu Account ID›')
  expect(resolve('{{NUEVO}}', {})).toBe('‹NUEVO›')
})

test('resuelve en profundidad sin romper el JSON', () => {
  expect(resolveDeep({ a: ['x {{BUCKET}}'] }, { VITE_BUCKET: 'b"1' })).toEqual({ a: ['x b"1'] })
})
