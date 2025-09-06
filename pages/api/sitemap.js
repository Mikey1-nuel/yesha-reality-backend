import { getProperties } from "@/database"; // adjust path if needed

export default async function handler(req, res) {
  const baseUrl = "https://www.yesharealty.com";

  const staticPages = [
    "",
    "properties",
    "contact",
    "about",
    "our-story",
    "real-estate-agent-registration",
  ];

  const propertyPages = await getProperties();

  const urls = [
    ...staticPages.map((page) => `${baseUrl}/${page}`),
    ...propertyPages.map((prop) => `${baseUrl}/properties/${prop.id}`),
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (url) => `
  <url>
    <loc>${url}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`
  )
  .join("")}
</urlset>`;

  res.setHeader("Content-Type", "application/xml");
  res.status(200).send(xml);
}
