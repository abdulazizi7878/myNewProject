import express from "express";
import puppeteer from "puppeteer";

const app = express();

app.get("/pdf", async (req, res) => {
  // 🧠 1. get data from URL
  const name = req.query.name || "Guest";

  // 🚀 2. start browser
  const browser = await puppeteer.launch({
    headless: "new"
  });

  const page = await browser.newPage();

  // 🧾 3. inject data into HTML
  const html = `
    <html>
      <body style="font-family: Arial; padding: 40px;">
        <h1>Hello ${name}</h1>
        <p>This PDF was generated dynamically from URL query!</p>
      </body>
    </html>
  `;

  await page.setContent(html);

  // 📄 4. generate PDF
  const pdf = await page.pdf({
    format: "A4",
    printBackground: true
  });

  await browser.close();

  // 📥 5. send to user as download
  res.set({
    "Content-Type": "application/pdf",
    "Content-Disposition": `attachment; filename="${name}.pdf"`
  });

  if(res.send(pdf)){
     alert("Your file has been downloaded");
  }
});

app.listen(3000, () => {
  console.log("http://localhost:3000/");
});