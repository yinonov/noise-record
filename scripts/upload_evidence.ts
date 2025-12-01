
import ImageKit from 'imagekit';
import * as fs from 'fs';
import * as path from 'path';
import * as mime from 'mime-types';
import * as dotenv from 'dotenv';

dotenv.config();

const PUBLIC_KEY = process.env.IMAGEKIT_PUBLIC_KEY;
const PRIVATE_KEY = process.env.IMAGEKIT_PRIVATE_KEY;
const URL_ENDPOINT = process.env.IMAGEKIT_URL_ENDPOINT;

if (!PUBLIC_KEY || !PRIVATE_KEY || !URL_ENDPOINT) {
  console.error('Missing ImageKit credentials in .env file');
  process.exit(1);
}

const imagekit = new ImageKit({
  publicKey: PUBLIC_KEY,
  privateKey: PRIVATE_KEY,
  urlEndpoint: URL_ENDPOINT,
});

import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ROOT_DIR = path.resolve(__dirname, '../מטרד שכן - תיעוד');
const OUTPUT_FILE = path.resolve(__dirname, '../public/data/evidence.json');

// Types matching the frontend
type EvidenceData = {
  categories: Category[];
};

type Category = {
  id: string;
  title: string;
  description: string | null;
  records: RecordItem[];
};

type RecordItem = {
  id: string;
  categoryId: string;
  title: string;
  occurredAt: string;
  media: MediaItem[];
};

type MediaItem = {
  id: string;
  type: 'image' | 'video';
  title: string;
  source: string;
  durationSeconds?: number | null;
  originalFilename: string;
};

// Simple cache to avoid re-uploading if we run script multiple times
// In a real scenario, we might check ImageKit API for existence, but for now
// let's just use a local cache file or check if we already have the URL in previous JSON?
// Checking ImageKit API for every file might be slow/rate-limited.
// Let's try to load existing evidence.json and check if file is already there.

let existingData: EvidenceData | null = null;
if (fs.existsSync(OUTPUT_FILE)) {
    try {
        existingData = JSON.parse(fs.readFileSync(OUTPUT_FILE, 'utf-8'));
    } catch (e) {
        console.warn("Could not parse existing evidence.json");
    }
}

function findExistingUrl(originalFilename: string, categoryTitle: string, recordTitle: string): string | null {
    if (!existingData) return null;
    const cat = existingData.categories.find(c => c.title === categoryTitle);
    if (!cat) return null;
    const rec = cat.records.find(r => r.title === recordTitle);
    if (!rec) return null;
    const media = rec.media.find(m => m.originalFilename === originalFilename);
    return media ? media.source : null;
}

async function uploadFile(filePath: string, fileName: string, folderPath: string): Promise<string> {
  console.log(`Uploading ${fileName} to ${folderPath}...`);
  const fileContent = fs.readFileSync(filePath);

  try {
      const response = await imagekit.upload({
          file: fileContent, // required
          fileName: fileName, // required
          folder: folderPath,
          useUniqueFileName: false, // Keep original name if possible
          overwriteAI: false, 
          overwriteTags: false,
          overwriteCustomMetadata: false,
      });
      return response.url;
  } catch (error) {
      console.error(`Failed to upload ${fileName}:`, error);
      throw error;
  }
}

function parseDateFromFolderName(folderName: string): { date: string; title: string } {
  // Try to match DD-MM-YYYY or DD-MM-YY at the start
  const dateRegex = /^(\d{2}-\d{2}-\d{4}|\d{2}-\d{2}-\d{2})/;
  const match = folderName.match(dateRegex);

  if (match) {
    const dateStr = match[1];
    const title = folderName.substring(dateStr.length).trim() || folderName;
    
    // Convert DD-MM-YYYY to ISO YYYY-MM-DD
    const parts = dateStr.split('-');
    let year = parts[2];
    if (year.length === 2) year = '20' + year;
    const isoDate = `${year}-${parts[1]}-${parts[0]}`;
    
    return { date: isoDate, title: title };
  }

  return { date: new Date().toISOString().split('T')[0], title: folderName };
}

async function processDirectory() {
  const evidenceData: EvidenceData = { categories: [] };
  
  if (!fs.existsSync(ROOT_DIR)) {
      console.error(`Directory not found: ${ROOT_DIR}`);
      return;
  }

  const categoryFolders = fs.readdirSync(ROOT_DIR).filter(f => {
      const fullPath = path.join(ROOT_DIR, f);
      return fs.statSync(fullPath).isDirectory() && !f.startsWith('.');
  });

  for (const catFolder of categoryFolders) {
    const catPath = path.join(ROOT_DIR, catFolder);
    const category: Category = {
      id: Buffer.from(catFolder).toString('base64'),
      title: catFolder,
      description: null,
      records: [],
    };

    const recordFolders = fs.readdirSync(catPath).filter(f => {
         const fullPath = path.join(catPath, f);
         return fs.statSync(fullPath).isDirectory() && !f.startsWith('.');
    });

    for (const recFolder of recordFolders) {
        const recPath = path.join(catPath, recFolder);
        const { date, title } = parseDateFromFolderName(recFolder);
        
        const record: RecordItem = {
            id: Buffer.from(`${catFolder}-${recFolder}`).toString('base64'),
            categoryId: category.id,
            title: title,
            occurredAt: date,
            media: []
        };

        const files = fs.readdirSync(recPath).filter(f => !f.startsWith('.') && f !== '.DS_Store');
        
        for (const file of files) {
            const filePath = path.join(recPath, file);
            if (fs.statSync(filePath).isDirectory()) continue;

            const mimeType = mime.lookup(filePath);
            if (!mimeType) continue;

            const isImage = mimeType.startsWith('image/');
            const isVideo = mimeType.startsWith('video/');

            if (!isImage && !isVideo) continue;

            // Check file size (ImageKit free tier limit: 100MB for video, 20MB for others)
            const stats = fs.statSync(filePath);
            const fileSizeInBytes = stats.size;
            const limit = 100 * 1024 * 1024; // 100MB

            let url = findExistingUrl(file, catFolder, title);

            if (!url) {
                if (fileSizeInBytes > limit) {
                    console.warn(`Skipping ${file} (Size: ${(fileSizeInBytes / 1024 / 1024).toFixed(2)}MB) - Exceeds 100MB limit`);
                    // Use a placeholder that the UI can recognize
                    url = `error://too-large?name=${encodeURIComponent(file)}`;
                } else {
                    // Upload to ImageKit
                    // Sanitize folder path for ImageKit (replace non-ascii with _)
                    // ImageKit folder names: alphanumeric, -, _, /
                    const safeCat = catFolder.replace(/[^a-zA-Z0-9\-_]/g, '_');
                    const safeRec = recFolder.replace(/[^a-zA-Z0-9\-_]/g, '_');
                    const uploadFolder = `/evidence/${safeCat}/${safeRec}`;
                    
                    try {
                        url = await uploadFile(filePath, file, uploadFolder);
                    } catch (e: any) {
                        if (e.message && e.message.includes('size exceeds')) {
                             console.warn(`Skipping ${file} due to size limit error from API`);
                             url = `error://too-large?name=${encodeURIComponent(file)}`;
                        } else {
                            console.error(`Skipping ${file} due to upload error`, e);
                            continue;
                        }
                    }
                }
            } else {
                console.log(`Using existing URL for ${file}`);
            }

            record.media.push({
                id: Buffer.from(`${catFolder}-${recFolder}-${file}`).toString('base64'),
                type: isImage ? 'image' : 'video',
                title: file,
                source: url,
                originalFilename: file
            });
        }

        if (record.media.length > 0) {
            category.records.push(record);
        }
    }

    if (category.records.length > 0) {
        evidenceData.categories.push(category);
    }
  }

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(evidenceData, null, 2));
  console.log(`Generated ${OUTPUT_FILE}`);
}

processDirectory().catch(console.error);
