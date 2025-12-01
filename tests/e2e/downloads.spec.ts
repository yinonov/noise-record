import { expect, test } from '@playwright/test'

const fixture = {
  categories: [
    {
      id: 'cat-1',
      title: 'Category A',
      description: null,
      records: [
        {
          id: 'rec-1',
          categoryId: 'cat-1',
          title: 'Record A',
          occurredAt: '2025-11-20T23:15:00Z',
          media: [
            {
              id: 'm1',
              type: 'video',
              title: 'Clip 1',
              source: '/media/video/clip1.mp4',
              durationSeconds: 12,
              originalFilename: 'clip1.mp4',
            },
            {
              id: 'm2',
              type: 'image',
              title: 'Frame',
              source: '/media/image/frame1.jpg',
              originalFilename: 'frame1.jpg',
            },
          ],
        },
      ],
    },
  ],
}

test.describe('Record open and downloads', () => {
  test('open record and download single/multi', async ({ page }) => {
    await page.route('**/data/evidence.json', async (route) => {
      await route.fulfill({ json: fixture, headers: { 'access-control-allow-origin': '*' } })
    })

    await page.route('**/media/**', async (route) => {
      await route.fulfill({ body: 'test', headers: { 'content-type': 'application/octet-stream' } })
    })

    await page.goto('/')

    await expect(page.getByText('Category A')).toBeVisible()
    await page.getByRole('button', { name: /^Record A/ }).first().click()

    const downloadSingle = page.waitForEvent('download')
    await page.getByRole('button', { name: /^Download$/ }).click()
    const single = await downloadSingle
    expect(single.suggestedFilename()).toBe('clip1.mp4')

    const downloads: string[] = []
    page.on('download', (d) => downloads.push(d.suggestedFilename()))
    await page.getByRole('button', { name: /Download all/ }).click()
    await page.waitForTimeout(500)
    expect(downloads.sort()).toEqual(['clip1.mp4', 'frame1.jpg'])
  })
})
