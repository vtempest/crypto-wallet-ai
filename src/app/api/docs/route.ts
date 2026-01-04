import { NextResponse } from 'next/server';

export const dynamic = 'force-static';

export async function GET() {
  // Generate HTML with Scalar UI
  const html = `
<!DOCTYPE html>
<html>
  <head>
    <title>Crypto Wallet AI - API Documentation</title>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <style>
      body {
        margin: 0;
        padding: 0;
      }
    </style>
  </head>
  <body>
    <script
      id="api-reference"
      data-url="/openapi.json"
      data-configuration='{
        "theme": "purple",
        "layout": "modern",
        "darkMode": true
      }'></script>
    <script src="https://cdn.jsdelivr.net/npm/@scalar/api-reference"></script>
  </body>
</html>
  `;

  return new NextResponse(html, {
    headers: {
      'Content-Type': 'text/html',
    },
  });
}
