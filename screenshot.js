const { chromium } = require("playwright");
const fs = require("fs");

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  const baseUrl = "http://localhost:3000";

  await page.goto(baseUrl, {
    waitUntil: "networkidle",
    timeout: 60000,
  });

  await page.waitForTimeout(5000);

  // Collect all internal links
  const links = await page.$$eval("a", (anchors) =>
    anchors.map((a) => a.href)
  );

  const uniqueLinks = [...new Set(links)].filter((link) =>
    link.startsWith(baseUrl)
  );

  console.log("Found Links:", uniqueLinks);

  // Always include homepage
  if (!uniqueLinks.includes(baseUrl)) {
    uniqueLinks.unshift(baseUrl);
  }

  if (!fs.existsSync("screenshots")) {
    fs.mkdirSync("screenshots");
  }

  for (let i = 0; i < uniqueLinks.length; i++) {
    const url = uniqueLinks[i];
    try {
      console.log("Capturing:", url);
      await page.goto(url, {
        waitUntil: "networkidle",
        timeout: 60000,
      });

      await page.waitForTimeout(3000);

      const fileName =
        "screenshots/page-" + i + ".png";

      await page.screenshot({
        path: fileName,
        fullPage: true,
      });
    } catch (err) {
      console.log("Failed:", url);
    }
  }

  await browser.close();
})();
