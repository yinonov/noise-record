import { beforeEach, describe, expect, it, vi } from 'vitest'
import { downloadAllSequential, downloadFile } from '../../src/utils/downloads'

beforeEach(() => {
  vi.restoreAllMocks()
})

describe('downloads', () => {
  it('triggers download for single file', async () => {
    const createSpy = vi.spyOn(document, 'createElement')
    const anchor = document.createElement('a')
    const click = vi.spyOn(anchor, 'click')
    createSpy.mockReturnValue(anchor)

    await downloadFile('/file', 'file.txt')

    expect(click).toHaveBeenCalled()
    createSpy.mockRestore()
  })

  it('runs sequential downloads preserving filenames', async () => {
    const mock = vi.fn().mockResolvedValue(undefined)
    await downloadAllSequential(['/a', '/b'], ['a.txt', 'b.txt'], mock)
    expect(mock).toHaveBeenNthCalledWith(1, '/a', 'a.txt')
    expect(mock).toHaveBeenNthCalledWith(2, '/b', 'b.txt')
  })
})
