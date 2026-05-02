import type { MetadataRoute } from 'next'
import { siteConfig } from '@/lib/site'

// Pinned to the last known content update. Update when the portfolio
// content changes meaningfully so search engines don't re-crawl unnecessarily.
const LAST_MODIFIED = new Date('2026-05-02')

export default function sitemap(): MetadataRoute.Sitemap {
    return [
        {
            url: siteConfig.url,
            lastModified: LAST_MODIFIED,
            changeFrequency: 'monthly',
            priority: 1,
        },
    ]
}
