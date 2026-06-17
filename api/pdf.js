import puppeteer from "puppeteer-core";
import chromium from "@sparticuz/chromium";

export default async function handler(req, res) {
  let browser;

  try {
    const name = req.query.name || "Guest";

    browser = await puppeteer.launch({
      args: chromium.args,
      executablePath: await chromium.executablePath(),
      headless: chromium.headless,
    });

    const page = await browser.newPage();

    const html = `
      <html>
        <head>
          <meta charset="utf-8" />
        </head>
        <body style="font-family: Arial; padding: 40px;">
          <h1>Hello ${name}</h1>
          <p>PDF generated successfully 🚀</p>
        </body>
      </html>
    `;

    await page.setContent(html, { waitUntil: "networkidle0" });

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
    });

    await browser.close();

    // IMPORTANT: force proper binary response
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${name}.pdf"`
    );

    res.setHeader("Content-Length", pdfBuffer.length);

    return res.status(200).send(Buffer.from(pdfBuffer));

  } catch (err) {
    if (browser) await browser.close();

    console.error(err);

    return res.status(500).json({
      error: "PDF generation failed",
      details: err.message,
    });
  }
}