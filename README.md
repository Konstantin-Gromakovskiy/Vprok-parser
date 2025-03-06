# Parser Project

## Description

This cli-application for scrapping data from web-site that uses the Puppeteer library to scrape data from web pages. It
is designed to extract
product information such as price, rating, and review count, as well as take screenshots of the page.

### Key Features:

- Using Puppeteer to interact with web pages.
- Scraping product data from various websites.
- Generating page screenshots.
- Writing data to a text file.
- Fetching and filtering data via an API.

## Installation

1. Clone the repository:

   ```bash
   git clone git@github.com:Konstantin-Gromakovskiy/Vprok-parser.git
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

## Usage

1. Run the parserPage script:

   ```bash
   npm run parserPage
   ```
   This will scrape data from the specified websites and write it to a text file and make screenshots.
   The script prompts the user to enter the URL and region.

   You can try it with the following URL and region.

    ```bash
    https://vprok.ru/product/6a/wr/kywgikzshvaz4bby2lbp6afarackwr6a
    Тульская обл.
    ````

2. Run the parserAPI:

   ```bash
   npm run parserApi
   ```
   This will scrape data from the API and write it to a text file.

   You can try it with the following URL.

    ```bash
   https://www.vprok.ru/catalog/7383/kapusta
    ````
