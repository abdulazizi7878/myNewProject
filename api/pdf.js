import puppeteer from "puppeteer-core";
import chromium from "@sparticuz/chromium";

export default async function handler(req, res) {
  let browser;

  try {

    browser = await puppeteer.launch({
      args: chromium.args,
      executablePath: await chromium.executablePath(),
      headless: chromium.headless,
    });

    const page = await browser.newPage();


    const c = req.query.c;
    
    await page.goto(`${c}&code=456123`, {
     waitUntil: "networkidle0",
    });
    

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
    });

    await browser.close();

    // IMPORTANT: force proper binary response
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="2018_final_year_report_card.pdf"`
    );

    res.setHeader("Content-Length", pdfBuffer.length);

    return res.status(200).send(Buffer.from(pdfBuffer));

  } catch (err) {
    if (browser) await browser.close();

    console.error(err);

    return res.status(500).json({
      error: "PDF generation failed",
      message: "Try again!",
    });
  }
}