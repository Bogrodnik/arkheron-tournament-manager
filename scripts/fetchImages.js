import axios from "axios";
import * as cheerio from "cheerio";
import fs from "fs-extra";

import { weapons } from "../src/data/weapons.js";
import { crowns } from "../src/data/crowns.js";
import { amulets } from "../src/data/amulets.js";
import { utilityItems } from "../src/data/utilityItems.js";

const collections = [
  {
    name: "weapons",
    variable: "weapons",
    data: weapons,
    file: "./src/data/weapons.js",
  },
  {
    name: "crowns",
    variable: "crowns",
    data: crowns,
    file: "./src/data/crowns.js",
  },
  {
    name: "amulets",
    variable: "amulets",
    data: amulets,
    file: "./src/data/amulets.js",
  },
  {
    name: "utilityItems",
    variable: "utilityItems",
    data: utilityItems,
    file: "./src/data/utilityItems.js",
  },
];

const HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
};

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchImage(item) {
  try {
    console.log(`Scanning ${item.name}`);

    const response = await axios.get(
      item.wiki,
      {
        headers: HEADERS,
      }
    );

    const $ = cheerio.load(response.data);

    /*
    =====================================
    Grab EVERY image on the page
    =====================================
    */

    const images = [];

    $("img").each((_, img) => {
      const src = $(img).attr("src");

      if (!src) return;

      images.push(src);
    });

    /*
    =====================================
    Find first useful image
    =====================================
    */

    const image = images.find(
      (src) =>
        src.includes(".png") &&
        !src.includes("Wiki") &&
        !src.includes("Logo") &&
        !src.includes("logo") &&
        !src.includes("favicon")
    );

    if (!image) {
      console.log(
        `No image found for ${item.name}`
      );

      return "";
    }

    let finalImage = image;

    if (finalImage.startsWith("//")) {
      finalImage =
        "https:" + finalImage;
    }

    if (finalImage.startsWith("/")) {
      finalImage =
        "https://arkheron.wiki.gg" +
        finalImage;
    }

    console.log(
      `Found image for ${item.name}`
    );

    console.log(finalImage);

    return finalImage;
  }
  catch (err) {
    console.log(
      `Failed ${item.name}`
    );

    if (err.response) {
      console.log(
        `HTTP ${err.response.status}`
      );
    }
    else {
      console.log(err.message);
    }

    return "";
  }
}

async function processCollection(
  collection
) {
  const updated = [];

  console.log(
    `\nProcessing ${collection.name}\n`
  );

  for (const item of collection.data) {

    const image =
      await fetchImage(item);

    updated.push({
      ...item,
      image,
    });

    await sleep(1000);
  }

  const output =
`export const ${collection.variable} = ${JSON.stringify(
  updated,
  null,
  2
)};\n`;

  await fs.writeFile(
    collection.file,
    output
  );

  console.log(
    `Finished ${collection.name}`
  );
}

async function run() {
  for (const collection of collections) {
    await processCollection(
      collection
    );
  }

  console.log(
    "\nAll images complete.\n"
  );
}

run();