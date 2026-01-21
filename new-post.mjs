import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const title = process.argv[2];

if (!title) {
  console.error('Please provide a post title.');
  console.error('Usage: npm run new-post -- "My Post Title"');
  process.exit(1);
}

const slug = title
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/(^-|-$)+/g, '');

const date = new Date().toISOString();

const frontmatter = `---
title: "${title}"
date: ${date}
---

`;

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const filePath = path.join(__dirname, 'src', 'content', 'blog', `${slug}.mdx`);

if (fs.existsSync(filePath)) {
  console.error(`Error: Post already exists at ${filePath}`);
  process.exit(1);
}

fs.writeFileSync(filePath, frontmatter);

console.log(`Created new post: ${filePath}`);
