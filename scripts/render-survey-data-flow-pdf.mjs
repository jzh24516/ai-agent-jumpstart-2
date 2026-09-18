import { chromium } from '@playwright/test'
import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { pathToFileURL } from 'node:url'

const root = resolve(import.meta.dirname, '..')
const htmlPath = resolve(root, 'Survey-Collection-Solution-Data-Flow.html')
const pdfPath = resolve(root, 'Survey-Collection-Solution-Data-Flow.pdf')

const browser = await chromium.launch({ headless: true })
try {
  const page = await browser.newPage({ viewport: { width: 1280, height: 720 } })
  await page.goto(pathToFileURL(htmlPath).href, { waitUntil: 'load' })
  await page.emulateMedia({ media: 'print' })
  const slideCount = await page.locator('.slide').count()
  if (slideCount !== 17) throw new Error(`Expected 17 slides, found ${slideCount}.`)
  await page.pdf({
    path: pdfPath,
    printBackground: true,
    preferCSSPageSize: true,
    displayHeaderFooter: false,
  })
  const pdfSource = (await readFile(pdfPath)).toString('latin1')
  const pdfPageCount = pdfSource.match(/\/Type\s*\/Page\b/g)?.length ?? 0
  const mediaBox = pdfSource.match(/\/MediaBox\s*\[\s*0\s+0\s+([\d.]+)\s+([\d.]+)/)
  const pageWidth = Number(mediaBox?.[1])
  const pageHeight = Number(mediaBox?.[2])
  if (pdfPageCount !== slideCount) {
    throw new Error(`Expected ${slideCount} PDF pages, found ${pdfPageCount}.`)
  }
  if (Math.abs(pageWidth - 960) > 1 || Math.abs(pageHeight - 540) > 1) {
    throw new Error(`Expected a 960 x 540 pt page, found ${pageWidth} x ${pageHeight}.`)
  }
  console.log(`Generated ${pdfPath}: ${pdfPageCount} pages at ${pageWidth} x ${pageHeight} pt.`)
} finally {
  await browser.close()
}