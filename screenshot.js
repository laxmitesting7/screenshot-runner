const { chromium } = require("playwright");

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  console.log("Waiting for server...");

  for (let i = 0; i < 10; i++) {
    try {
      await page.goto("http://localhost:3000", {
        waitUntil: "networkidle",
        timeout: 5000,
      });
      console.log("Server connected!");
      break;
    } catch (err) {
      console.log("Retrying...");
      await new Promise((r) => setTimeout(r, 3000));
    }
  }

  await page.screenshot({
    path: "homepage.png",
    fullPage: true,
  });

  await browser.close();
})();
