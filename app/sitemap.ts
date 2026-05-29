import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: "https://www.useclickads.com", lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: "https://www.useclickads.com/services", lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: "https://www.useclickads.com/products", lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: "https://www.useclickads.com/blog", lastModified: new Date(), changeFrequency: "daily", priority: 0.8 },
    { url: "https://www.useclickads.com/contact", lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: "https://www.useclickads.com/resources", lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },
    { url: "https://www.useclickads.com/company", lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
  ];
}
