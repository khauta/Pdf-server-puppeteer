export interface PdfOptions {
    format?: string;
    printBackground?: boolean;
    margin?: {
        top?: string;
        bottom?: string;
        left?: string;
        right?: string;
    };
    scale?: number;
    displayHeaderFooter?: boolean;
    landscape?: boolean;
    waitUntil?: 'load' | 'domcontentloaded' | 'networkidle0' | 'networkidle2';
    timeout?: number;
    emulateMedia?: 'screen' | 'print';
}
