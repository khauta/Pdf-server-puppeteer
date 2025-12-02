"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generatePdfFromHtml = void 0;
const puppeteer_1 = __importDefault(require("puppeteer"));
const chromium_1 = __importDefault(require("@sparticuz/chromium"));
let browserPromise = null;
const getBrowser = async () => {
    if (!browserPromise) {
        browserPromise = puppeteer_1.default.launch({
            args: [
                ...chromium_1.default.args,
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
                '--disable-gpu',
                '--single-process',
                '--no-zygote'
            ],
            defaultViewport: chromium_1.default.defaultViewport,
            executablePath: await chromium_1.default.executablePath(),
            headless: chromium_1.default.headless,
        });
    }
    return browserPromise;
};
const generatePdfFromHtml = async (html, options = {}) => {
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
    }
    finally {
        await page.close();
    }
};
exports.generatePdfFromHtml = generatePdfFromHtml;
