"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const pdfGenerator_1 = require("../services/pdfGenerator");
const zod_1 = require("zod");
const router = (0, express_1.Router)();
const GenerateSchema = zod_1.z.object({
    html: zod_1.z.string().min(10),
    options: zod_1.z.object({}).passthrough().optional(),
    emulateMedia: zod_1.z.enum(['screen', 'print']).optional(),
});
const GenerateFromUrlSchema = zod_1.z.object({
    url: zod_1.z.string().url(),
    options: zod_1.z.object({}).passthrough().optional(),
    auth: zod_1.z.object({
        username: zod_1.z.string(),
        password: zod_1.z.string(),
    }).optional(),
});
router.post('/generate', async (req, res, next) => {
    try {
        const { html, options = {}, emulateMedia } = GenerateSchema.parse(req.body);
        const pdfBuffer = await (0, pdfGenerator_1.generatePdfFromHtml)(html, { ...options, emulateMedia });
        const filename = `document-${new Date().toISOString().split('T')[0]}.pdf`;
        res
            .set({
            'Content-Type': 'application/pdf',
            'Content-Disposition': `attachment; filename="${filename}"`,
            'Cache-Control': 'no-cache',
        })
            .send(pdfBuffer);
    }
    catch (err) {
        next(err);
    }
});
router.post('/generate-from-url', async (req, res, next) => {
    try {
        // Note: The original spec didn't fully detail the implementation of generate-from-url in the service
        // but the route was requested. I will implement a basic version here that fetches HTML or uses Puppeteer to go to URL.
        // Since the service `generatePdfFromHtml` takes HTML, I might need to extend the service or fetch HTML here.
        // However, Puppeteer is best for URLs.
        // I will modify the service to support URL or create a new function in service if needed.
        // For now, I'll assume I can fetch the HTML or the user wants Puppeteer to navigate.
        // The spec says: "Renders public URL to PDF".
        // I'll stick to the spec's `generatePdfFromHtml` for now, but I should probably add `generatePdfFromUrl` to the service.
        // I will add a TODO comment or just implement it in the service in the next step if I realize it's missing.
        // Actually, looking at the spec, `generate-from-url` is a feature.
        // I will implement the route and then update the service to support it.
        // For now, let's just parse the body.
        const { url, options = {}, auth } = GenerateFromUrlSchema.parse(req.body);
        // I need to update the service to handle URL.
        // I'll send a 501 Not Implemented for now or try to use the service if I update it.
        // Let's update the service in a subsequent step.
        res.status(501).json({ error: 'Not implemented yet' });
    }
    catch (err) {
        next(err);
    }
});
exports.default = router;
