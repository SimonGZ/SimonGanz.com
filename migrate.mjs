import fs from 'node:fs';
import path from 'node:path';

const legacyDir = '_legacy/source';
const targetDir = 'src/content/blog';

// Ensure target directory exists
if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
}

// Helper to parse simple YAML frontmatter
function parseFrontmatter(content) {
    const match = content.match(/^---\n([\s\S]*?)\n---/);
    if (!match) return { frontmatter: {}, body: content };
    
    const frontmatterRaw = match[1];
    const body = content.slice(match[0].length);
    
    const frontmatter = {};
    const lines = frontmatterRaw.split('\n');
    for (const line of lines) {
        const parts = line.split(':');
        if (parts.length >= 2) {
            const key = parts[0].trim();
            let value = parts.slice(1).join(':').trim();
            // Remove quotes if present
            if (value.startsWith('"') && value.endsWith('"')) {
                value = value.slice(1, -1);
            }
            frontmatter[key] = value;
        }
    }
    return { frontmatter, body };
}

// Process files
const files = fs.readdirSync(legacyDir);

for (const file of files) {
    if (!file.endsWith('.html.markdown.erb')) continue;

    const filePath = path.join(legacyDir, file);
    const content = fs.readFileSync(filePath, 'utf-8');
    
    // Extract date and slug from filename
    // Format: YYYY-MM-DD-title.html.markdown.erb
    const filenameMatch = file.match(/^(\d{4}-\d{2}-\d{2})-(.+)\.html\.markdown\.erb$/);
    if (!filenameMatch) continue;
    
    const dateStr = filenameMatch[1];
    const slug = filenameMatch[2];
    
    const { frontmatter, body } = parseFrontmatter(content);
    
    // Transform Body
    let newBody = body;
    
    // Remove {::nomarkdown} and {:/}
    newBody = newBody.replace(/{::nomarkdown}/g, '');
    newBody = newBody.replace(/{:\/}/g, '');
    
    // Replace image_path helper
    // <%= image_path 'foo.jpg' %> -> /images/foo.jpg
    newBody = newBody.replace(/<%= image_path ['"](.+?)['"] %>/g, (match, p1) => {
        return `/images/${p1}`;
    });
    
    // Replace READMORE marker with <!-- more -->
    // Legacy format was often: 
    // READMORE
    // <a id="more" />
    newBody = newBody.replace(/READMORE\s*<a id="more" \/>/g, '\n{/* more */}\n');
    newBody = newBody.replace(/READMORE/g, '\n{/* more */}\n');
    
    // Fix void tags for MDX (simple regex pass, might need manual check for edge cases)
    // <img ... > -> <img ... />
    newBody = newBody.replace(/<img([^>]+)(?<!\/)>/g, '<img$1 />');
    // <source ... > -> <source ... />
    newBody = newBody.replace(/<source([^>]+)(?<!\/)>/g, '<source$1 />');
    
    // Reconstruct Frontmatter
    // Ensure date is present (use filename date if not in frontmatter)
    if (!frontmatter.date) {
        frontmatter.date = dateStr;
    } else {
        // Fix date format if it contains timezone abbreviations like PDT/PST which JS Date might stumble on strictly, 
        // though usually it's fine. Middleman dates were often YYYY-MM-DD HH:MM Z or similar.
        // For Astro/Zod, a standard ISO string or YYYY-MM-DD is safest.
        // We'll trust the frontmatter date unless it fails parsing later.
    }
    
    const newFrontmatter = [
        '---',
        `title: "${frontmatter.title || slug}"`,
        `date: ${new Date(frontmatter.date).toISOString()}`,
        frontmatter.tags ? `tags: "${frontmatter.tags}"` : '',
        frontmatter.description ? `description: "${frontmatter.description}"` : '',
        frontmatter.readmore ? `readMoreText: "${frontmatter.readmore}"` : '',
        '---'
    ].filter(Boolean).join('\n');
    
    const newContent = `${newFrontmatter}\n${newBody}`;
    
    const targetPath = path.join(targetDir, `${slug}.mdx`);
    fs.writeFileSync(targetPath, newContent);
    console.log(`Migrated ${file} -> ${slug}.mdx`);
}
