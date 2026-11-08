import {readFile, readdir, mkdir, writeFile, cp, rm} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
import matter from 'gray-matter';
import {marked} from 'marked';
import sanitizeHtml from 'sanitize-html';
const root = path.dirname(fileURLToPath(import.meta.url));
const output = path.join(root, 'dist');
const postsPath = path.join(root, 'content/posts');
const posts = [];
const ids = new Set();
for (const filename of (await readdir(postsPath)).sort()) {
  if (!filename.endsWith('.md')) continue;
  const {data, content} = matter(await readFile(path.join(postsPath, filename), 'utf8'));
  if (data.draft === true) continue;
  const id = Number(data.id);
  if (!Number.isSafeInteger(id) || id < 1 || ids.has(id)) throw Error(`${filename}: id must be a unique positive integer`);
  if (typeof data.title !== 'string' || !data.title.trim()) throw Error(`${filename}: title is required`);
  const date = new Date(data.date);
  if (Number.isNaN(date.getTime())) throw Error(`${filename}: valid date is required`);
  ids.add(id);
  const html = sanitizeHtml(marked.parse(content, {gfm:true, breaks:true}), {
    allowedTags: [...sanitizeHtml.defaults.allowedTags, 'img', 'details', 'summary', 'figure', 'figcaption', 'video', 'audio', 'source'],
    allowedAttributes: {
      '*': ['class', 'style', 'title'], a: ['href','target','rel'], img: ['src','alt','width','height','loading'],
      details: ['open'], th: ['colspan','rowspan','align'], td: ['colspan','rowspan','align'],
      video: ['src','controls','poster','width','height'], audio: ['src','controls'], source: ['src','type'],
    },
    allowedStyles: {'*': {
      color: [/^#[\da-f]{3,8}$/i, /^[a-z]+$/i, /^rgba?\([\d\s.,%]+\)$/],
      'background-color': [/^#[\da-f]{3,8}$/i, /^[a-z]+$/i],
      'text-align': [/^(left|right|center|justify)$/],
      'font-weight': [/^(normal|bold|[1-9]00)$/],
      'font-style': [/^(normal|italic)$/],
      'text-decoration': [/^(underline|line-through|none)$/],
      'font-size': [/^\d+(\.\d+)?(px|em|rem|%)$/],
      width: [/^\d+(\.\d+)?(px|em|rem|%)$/], 'max-width': [/^\d+(\.\d+)?(px|em|rem|%)$/],
    }},
    transformTags: {a: sanitizeHtml.simpleTransform('a',{rel:'noopener noreferrer'})},
  });
  posts.push({number:id,title:data.title.trim(),created_at:date.toISOString(),pinned:data.pinned===true,
    category:{name:String(data.category||'잡담'),slug:String(data.categorySlug||data.category||'잡담'),emoji:String(data.emoji||'💬')},
    body_html:html,
  });
}
// Only replace generated output after every source file has passed validation.
await rm(output,{recursive:true,force:true});
await mkdir(path.join(output,'data/posts'),{recursive:true});
for(const file of ['index.html','post.html','diary.css']) await cp(path.join(root,file),path.join(output,file));
try{await cp(path.join(root,'images'),path.join(output,'images'),{recursive:true});}catch(error){if(error.code!=='ENOENT')throw error;}
posts.sort((a,b)=>Number(b.pinned)-Number(a.pinned)||new Date(b.created_at)-new Date(a.created_at));
await writeFile(path.join(output,'data/posts.json'),JSON.stringify(posts.map(({body_html,...post})=>post)));
for(const post of posts)await writeFile(path.join(output,'data/posts',`${post.number}.json`),JSON.stringify(post));
console.log(`Built ${posts.length} Markdown posts. No GitHub API requests needed for readers.`);
