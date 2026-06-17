import puppeteer from "puppeteer-core";
import chromium from "@sparticuz/chromium";

export default async function handler(req, res) {
  try {
    const name = req.query.name || "Guest";

    const browser = await puppeteer.launch({
      args: chromium.args,
      executablePath: await chromium.executablePath(),
      headless: chromium.headless,
    });

    const page = await browser.newPage();

    const html = `
      <html>
        <body style="font-family: Arial; padding: 40px;">
          <h1>Hello ${name}</h1>
          <p>Your PDF was generated on Vercel 🚀</p>
        </body>
      </html>
    `;

    await page.setContent(html);

    const pdf = await page.pdf({
      format: "A4",
      printBackground: true,
    });

    await browser.close();

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${name}.pdf"`
    );

    res.status(200).send(pdf);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}