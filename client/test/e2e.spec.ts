import path from 'node:path'
import {
  type ElectronApplication,
  type Page,
  type JSHandle,
  _electron as electron,
} from 'playwright'
import type { BrowserWindow } from 'electron'
import {
  beforeAll,
  afterAll,
  describe,
  expect,
  test,
} from 'vitest'

const root = path.join(__dirname, '..')
let electronApp: ElectronApplication
let page: Page

if (process.platform === 'linux') {
  // pass ubuntu
  test(() => expect(true).true)
} else {
  beforeAll(async () => {
    electronApp = await electron.launch({
      args: ['.', '--no-sandbox'],
      cwd: root,
      env: { ...process.env, NODE_ENV: 'development' },
    })
    page = await electronApp.firstWindow()

    const mainWin: JSHandle<BrowserWindow> = await electronApp.browserWindow(page)
    await mainWin.evaluate(async (win) => {
      win.webContents.executeJavaScript('console.log("Execute JavaScript with e2e testing.")')
    })
  })

  afterAll(async () => {
    await page.screenshot({ path: 'test/screenshots/e2e.png' })
    await page.close()
    await electronApp.close()
  })

  describe('무임하차 e2e — smoke', async () => {
    test('startup: window opens with project title', async () => {
      const title = await page.title()
      expect(title).eq('무임하차')
    })

    // 보일러플레이트 데모 화면(h1/카운터 버튼) 의존 테스트는
    // UI 구현 착수 시 실제 화면용으로 교체. client/README.md "다음 단계" 참조.
    test.skip('placeholder: 실제 UI 구현 후 화면 단위 테스트 추가', () => {})
  })
}
