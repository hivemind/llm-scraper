import z from 'zod'
import { chromium } from 'playwright'
import LLMScraper from './../src'

// Create a new browser instance
const browser = await chromium.launch()

// Define schema to extract contents into
const schema = z.object({
  top: z
    .array(
      z.object({
        title: z.string(),
        points: z.number(),
        by: z.string(),
        commentsURL: z.string(),
      })
    )
    .length(5)
    .describe('Top 5 stories on Hacker News'),
})

// Initialize the LLMScraper instance
const scraper = new LLMScraper(browser, {
  model: 'gpt-3.5-turbo',
  schema,
  mode: 'markdown',
  closeOnFinish: true,
})

// URLs to scrape
const urls = ['https://news.ycombinator.com']

// Run the scraper
const pages = await scraper.run(urls)

// Stream the result from LLM
for await (const page of pages) {
  console.log(page.data)
}
