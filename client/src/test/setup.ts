import { afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'
import '@testing-library/jest-dom/vitest'

if (typeof HTMLDialogElement !== 'undefined') {
  HTMLDialogElement.prototype.close = function close() {}
  HTMLDialogElement.prototype.showModal = function showModal() {}
}

afterEach(() => {
  cleanup()
})
