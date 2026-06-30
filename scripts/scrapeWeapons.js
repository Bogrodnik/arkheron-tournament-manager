import axios from "axios";
import * as cheerio from "cheerio";
import fs from "fs-extra";

const BASE_URL = "https://arkheron.wiki.gg";

async function scrapeWeapons() {
    console.log("Fetching weapons page...");

    const response = await axios.get(
        `${BASE_URL}/wiki/Weapons`
    );

    const $ = cheerio.load(response.data);

    const weapons = [];
    const seen = new Set();

    $("a[href^='/wiki/']").each((_, element) => {
        const href = $(element).attr("href");

        if (!href) return;

        /*
        =====================================
        Ignore non-weapon pages
        =====================================
        */

        if (
            href.includes("File:") ||
            href.includes("Category:") ||
            href.includes("Special:") ||
            href.includes("#")
        ) {
            return;
        }

        /*
        =====================================
        Extract weapon name
        =====================================
        */

        const name = decodeURIComponent(
            href
                .replace("/wiki/", "")
                .replace(/_/g, " ")
        );

        /*
        =====================================
        Generate ID
        =====================================
        */

        const id = name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-|-$/g, "");

        if (seen.has(id)) return;

        seen.add(id);

        /*
        =====================================
        Detect weapon type
        =====================================
        */

        let category = "Base";
        let owner = null;

        if (name.includes("'s ")) {
            category = "Eternal";
            owner = name.split("'s ")[0];
        }

        weapons.push({
            id,
            name,
            image: "",
            wiki: `${BASE_URL}${href}`,
            category,
            owner
        });
    });

    weapons.sort((a, b) =>
        a.name.localeCompare(b.name)
    );

    const output =
`export const weapons = ${JSON.stringify(
    weapons,
    null,
    2
)};\n`;

    await fs.writeFile(
        "./src/data/weapons.js",
        output
    );

    console.log(
        `Saved ${weapons.length} weapons`
    );
}

scrapeWeapons();