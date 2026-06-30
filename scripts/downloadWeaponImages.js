import axios from "axios";
import * as cheerio from "cheerio";
import fs from "fs-extra";
import path from "path";

import { weapons } from "../src/data/weapons.js";

const IMAGE_FOLDER = "./public/images/weapons";

await fs.ensureDir(IMAGE_FOLDER);

const HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36",
};

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function downloadImage(url, filepath) {
  const response = await axios.get(url, {
    responseType: "arraybuffer",
    headers: HEADERS,
  });

  await fs.writeFile(filepath, response.data);
}

async function getImageUrl(pageHtml) {
  const $ = cheerio.load(pageHtml);

  const selectors = [
    ".portable-infobox img",
    ".infobox img",
    ".pi-image-thumbnail",
    ".mw-parser-output img",
    "img"
  ];

  for (const selector of selectors) {
    const src = $(selector).first().attr("src");

    if (src) {
      if (src.startsWith("//")) {
        return `https:${src}`;
      }

      if (src.startsWith("/")) {
        return `https://arkheron.wiki.gg${src}`;
      }

      return src;
    }
  }

  return null;
}

async function run() {

  console.log(
    `Starting download for ${weapons.length} weapons`
  );

  for (const weapon of weapons) {

    try {

      const filename =
        `${weapon.id}.png`;

      const filepath =
        path.join(
          IMAGE_FOLDER,
          filename
        );

      /*
      Skip existing files
      */

      if (await fs.pathExists(filepath)) {
        console.log(
          `Skipping ${weapon.name}`
        );
        continue;
      }

      console.log(
        `Fetching page for ${weapon.name}`
      );

      const pageResponse =
        await axios.get(
          weapon.wiki,
          {
            headers: HEADERS
          }
        );

      const imageUrl =
        await getImageUrl(
          pageResponse.data
        );

      if (!imageUrl) {

        console.log(
          `No image found for ${weapon.name}`
        );

        continue;
      }

      console.log(
        `Downloading image for ${weapon.name}`
      );

      await downloadImage(
        imageUrl,
        filepath
      );

      console.log(
        `Saved ${filename}`
      );

      /*
      Prevent rate limiting
      */

      await sleep(1000);

    }
    catch (err) {

      console.log(
        `Failed: ${weapon.name}`
      );

      if (err.response) {
        console.log(
          `HTTP ${err.response.status}`
        );
      }
      else {
        console.log(
          err.message
        );
      }

      await sleep(2000);
    }
  }

  console.log(
    "Finished downloading weapon images."
  );
}

run();