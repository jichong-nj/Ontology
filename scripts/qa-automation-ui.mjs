#!/usr/bin/env node
// Automation UI 回归测试（只读）：路由/列表/历史/链路列/编辑器
// 前置：后端 :4000、前端 dev server :5173
// 用法：npm run qa:automation:ui
import { chromium } from 'playwright';

const WEB = process.env.WEB_BASE ?? 'http://localhost:5173';
let pass = 0;
let fail = 0;

function check(name, cond, detail = '') {
  if (cond) { pass++; console.log(`✅ ${name}`); }
  else { fail++; console.log(`❌ ${name} ${detail}`); }
}

const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH ?? '/usr/bin/google-chrome', args: ['--no-sandbox'] });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

try {
  await page.goto(`${WEB}/s2/rules`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1200);

  check('旧 /s2/rules 重定向到 Automation', page.url().includes('/s2/automations'), page.url());
  check('页面标题为 Automation', (await page.locator('h2.page-title').textContent()).includes('Automation'));
  check('automation 列表非空', (await page.locator('.rule-table tbody tr').count()) >= 3, String(await page.locator('.rule-table tbody tr').count()));
  check('效果列有标签', (await page.locator('.effect-tag').count()) >= 3, String(await page.locator('.effect-tag').count()));

  await page.getByRole('button', { name: '历史' }).first().click();
  await page.waitForTimeout(800);
  const dlg = page.locator('.el-dialog').filter({ hasText: '运行历史' });
  check('历史弹窗打开', await dlg.isVisible());
  check('历史有记录', (await dlg.locator('tbody tr').count()) > 0, String(await dlg.locator('tbody tr').count()));
  check('历史含链路列', (await dlg.locator('thead').textContent()).includes('链路'));
  const firstTime = await dlg.locator('tbody tr').first().locator('td').first().textContent();
  check('时间已本地化', !String(firstTime).includes('T') && !String(firstTime).includes('Z'), String(firstTime));
  await dlg.getByRole('button', { name: '关闭' }).click();
  await page.waitForTimeout(300);

  await page.getByRole('button', { name: '编辑' }).first().click();
  await page.waitForTimeout(600);
  check('编辑器有效果行', (await page.locator('.effect-row').count()) >= 1, String(await page.locator('.effect-row').count()));
  check('编辑器有 Cron 选项', (await page.getByText('Cron', { exact: true }).count()) >= 1);
  check('编辑器有执行策略', (await page.getByText('执行策略').count()) >= 1);
} catch (e) {
  console.error('UI 测试异常:', e);
  fail++;
} finally {
  await browser.close();
}

console.log(`\nUI 结果: ${pass} 通过, ${fail} 失败`);
process.exit(fail ? 1 : 0);
