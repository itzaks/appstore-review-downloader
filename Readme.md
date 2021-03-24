# app store reviews to csv

## Installation

```
cd appstore-review-downloader
npm install
```

Will output to output.csv

## Usage

`node index.js --id 333333333 us au se`
Where id is app store id, followed by a space separated list with the regions to fetch reviews for.

## Limits

Can't fetch more than 500 reviews per region
