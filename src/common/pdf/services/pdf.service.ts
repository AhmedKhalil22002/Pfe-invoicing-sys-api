import { Injectable } from '@nestjs/common';
import * as ejs from 'ejs';
import * as puppeteer from 'puppeteer';
import { join } from 'path';
import { promises as fs } from 'fs';

@Injectable()
export class PdfService {
  async generatePdf(data: any): Promise<Buffer> {
    const templatePath = join(
      __dirname,
      '..',
      '..',
      '..',
      'assets',
      'templates',
      'template.ejs',
    );
    const template = await fs.readFile(templatePath, 'utf8');

    const html = ejs.render(template, data);
    const browser = await puppeteer.launch({
      ignoreDefaultArgs: ['--disable-extensions'],
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    const page = await browser.newPage();
    await page.setContent(html);
    await page.addStyleTag({
      path: join(__dirname, '..', '..', '..', 'assets', 'css', 'bootstrap.css'),
    });
    const pdfBuffer = await page.pdf({ format: 'A4' });

    await browser.close();

    return pdfBuffer;
  }
}
