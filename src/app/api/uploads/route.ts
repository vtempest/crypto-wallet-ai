import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import * as pdfjs from 'pdfjs-serverless';
import mammoth from 'mammoth';

interface FileRes {
  fileName: string;
  fileExtension: string;
  fileId: string;
}

const uploadDir = path.join(process.cwd(), 'uploads');

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const files = formData.getAll('files') as File[];

    const processedFiles: FileRes[] = [];

    await Promise.all(
      files.map(async (file: any) => {
        const fileExtension = file.name.split('.').pop();
        if (!['pdf', 'docx', 'txt', 'html', 'htm'].includes(fileExtension!)) {
          return NextResponse.json(
            { message: 'File type not supported' },
            { status: 400 },
          );
        }

        const uniqueFileName = `${crypto.randomBytes(16).toString('hex')}.${fileExtension}`;
        const filePath = path.join(uploadDir, uniqueFileName);

        const buffer = Buffer.from(await file.arrayBuffer());
        fs.writeFileSync(filePath, new Uint8Array(buffer));

        let fullText = '';
        if (fileExtension === 'pdf') {
          const fileBuffer = fs.readFileSync(filePath);
          const data = new Uint8Array(fileBuffer);
          const pdfDoc = await pdfjs.getDocument(data).promise;
          const numPages = pdfDoc.numPages;

          for (let i = 1; i <= numPages; i++) {
            const page = await pdfDoc.getPage(i);
            const textContent = await page.getTextContent();
            const pageText = textContent.items.map((item: any) => item.str).join(' ');
            fullText += pageText + '\n';
          }
        } else if (fileExtension === 'docx') {
          const result = await mammoth.extractRawText({ path: filePath });
          fullText = result.value;
        } else if (fileExtension === 'txt') {
          fullText = fs.readFileSync(filePath, 'utf-8');
        } else if (fileExtension === 'html' || fileExtension === 'htm') {
          fullText = fs.readFileSync(filePath, 'utf-8');
        }

        const extractedDataPath = filePath.replace(/\.\w+$/, '-extracted.json');
        fs.writeFileSync(
          extractedDataPath,
          JSON.stringify({
            title: file.name,
            content: fullText,
          }),
        );

        processedFiles.push({
          fileName: file.name,
          fileExtension: fileExtension,
          fileId: uniqueFileName.replace(/\.\w+$/, ''),
        });
      }),
    );

    return NextResponse.json({
      files: processedFiles,
    });
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json(
      { message: 'An error has occurred.' },
      { status: 500 },
    );
  }
}
