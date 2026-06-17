import puppeteer from "puppeteer-core";
import chromium from "@sparticuz/chromium";

export default async function handler(req, res) {
  const browser = await puppeteer.launch({
    args: chromium.args,
    executablePath: await chromium.executablePath(),
    headless: chromium.headless,
  });

  const page = await browser.newPage();

  const name = req.query.name || "Guest";

  await page.setContent(`
    <h1>Hello ${name}</h1>
    <p>PDF generated successfully</p>
  `);

  const pdf = await page.pdf({ format: "A4" });

  await browser.close();

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", "attachment; filename=file.pdf");

  res.send(pdf);
}