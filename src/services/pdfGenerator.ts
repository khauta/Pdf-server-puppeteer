import puppeteer from 'puppeteer';
import chromium from '@sparticuz/chromium';

let browserPromise: Promise<any> | null = null;

const getBrowser = async () => {
    if (!browserPromise) {
        browserPromise = puppeteer.launch({
            args: [
                ...chromium.args,
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
                '--disable-gpu',
                '--single-process',
                '--no-zygote'
            ],
            defaultViewport: chromium.defaultViewport,
            executablePath: await chromium.executablePath(),
            headless: chromium.headless as any,
        });
    }
    return browserPromise;
};

export const generatePdfFromHtml = async (
    html: string,
    options: any = {}
) => {
    const browser = await getBrowser();
    const page = await browser.newPage();

    try {
        await page.setContent(html, {
            waitUntil: options.waitUntil || 'networkidle0',
            timeout: options.timeout || 30000,
        });

        if (options.emulateMedia) {
            await page.emulateMediaType(options.emulateMedia);
        }

        const pdfBuffer = await page.pdf({
            format: options.format || 'A4',
            printBackground: options.printBackground ?? true,
            margin: options.margin || { top: '20mm', bottom: '20mm', left: '15mm', right: '15mm' },
            scale: options.scale || 1,
            landscape: options.landscape || false,
            displayHeaderFooter: options.displayHeaderFooter || false,
        });

        return pdfBuffer;
    } finally {
        await page.close();
    }
};
