# LLM Scraper

<img width="1800" alt="Screenshot 2024-04-20 at 23 11 16" src="https://github.com/mishushakov/llm-scraper/assets/10400064/ab00e048-a9ff-43b6-81d5-2e58090e2e65">

LLM Scraper is a TypeScript library that allows you to convert **any** webpages into structured data using LLMs.

> [!TIP]
> Under the hood, it uses function calling to convert pages to structured data. You can find more about this approach [here](https://til.simonwillison.net/gpt3/openai-python-functions-data-extraction)

### Features

- Supports OpenAI, Groq chat models
- Schemas defined with Zod
- Full type-safety with TypeScript
- Based on Playwright framework
- Streaming when crawling multiple pages
- Supports 4 input modes:
  - `html` for loading raw HTML
  - `markdown` for loading markdown
  - `text` for loading extracted text (using [Readability.js](https://github.com/mozilla/readability))
  - `image` for loading a screenshot (multi-modal only)

**Make sure to give it a star!**

<img width="165" alt="Screenshot 2024-04-20 at 22 13 32" src="https://github.com/mishushakov/llm-scraper/assets/10400064/11e2a79f-a835-48c4-9f85-5c104ca7bb49">

## Getting started

1. Install the required dependencies from npm:

   ```
   npm i zod playwright llm-scraper
   ```

2. Get an OpenAI API key and set it in your environment variables:

   ```
   export OPENAI_API_KEY=***
   ```

3. Create a new browser instance and attach LLMScraper to it:

   ```js
   import { chromium } from 'playwright'
   import LLMScraper from 'llm-scraper'

   const browser = await chromium.launch()
   const scraper = new LLMScraper(browser, 'gpt-4-turbo', { /* model config */ })
   ```

## Example

In this example, we're extracting top stories from HackerNews:

```ts
import { chromium } from 'playwright'
import { z } from 'zod'
import LLMScraper from 'llm-scraper'

// Create a new browser instance
const browser = await chromium.launch()

// Initialize the LLMScraper instance
const scraper = new LLMScraper(browser, 'gpt-4-turbo')

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

// URLs to scrape
const urls = ['https://news.ycombinator.com']

// Run the scraper
const pages = await scraper.run(urls, {
  schema,
  mode: 'html',
  closeOnFinish: true,
})

// Stream the result from LLM
for await (const page of pages) {
  console.log(page.data)
}
```

## Contributing

As an open-source project, we welcome contributions from the community. If you are experiencing any bugs or want to add some improvements, please feel free to open an issue or pull request.
