import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Modal } from '../../src/components/Modal'
import type { RecordItem } from '../../src/utils/dataLoader'

const record: RecordItem = {
  id: 'rec-1',
  categoryId: 'cat-1',
  title: 'Record',
  occurredAt: '2025-11-20T23:15:00Z',
  media: [
    { id: 'm1', type: 'image', title: 'Image 1', source: '/img1.jpg', originalFilename: 'img1.jpg' },
    { id: 'm2', type: 'image', title: 'Image 2', source: '/img2.jpg', originalFilename: 'img2.jpg' },
  ],
}

describe('Modal', () => {
  it('closes on escape and keeps focus inside', async () => {
    const onClose = vi.fn()
    render(
      <Modal
        open
        record={record}
        mediaIndex={0}
        onClose={onClose}
        onNavigate={() => {}}
        onDownloadSingle={() => {}}
        onDownloadAll={() => {}}
      />
    )

    const user = userEvent.setup()
    await user.keyboard('{Escape}')
    expect(onClose).toHaveBeenCalled()

    const buttons = screen.getAllByRole('button')
    await user.tab()
    expect(buttons[0]).toHaveFocus()
    await user.tab({ shift: true })
    expect(buttons[buttons.length - 1]).toHaveFocus()
  })

  it('navigates with arrow keys', () => {
    const onNavigate = vi.fn()
    render(
      <Modal
        open
        record={record}
        mediaIndex={0}
        onClose={() => {}}
        onNavigate={onNavigate}
        onDownloadSingle={() => {}}
        onDownloadAll={() => {}}
      />
    )
    fireEvent.keyDown(window, { key: 'ArrowRight' })
    expect(onNavigate).toHaveBeenCalledWith('next')
    fireEvent.keyDown(window, { key: 'ArrowLeft' })
    expect(onNavigate).toHaveBeenCalledWith('prev')
  })
})
