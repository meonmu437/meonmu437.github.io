import {readFile, writeFile, mkdir} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
import matter from 'gray-matter';

const REPOSITORY = 'meonmu437/meonmu437.github.io';
const OWNER = 'meonmu437';
const directory = path.join(path.dirname(fileURLToPath(import.meta.url)), 'content/posts');

// Discussion text is data, never a shell command or executable workflow expression.
export async function syncDiscussions(discussions, {postsDirectory = directory} = {}) {
  if (!Array.isArray(discussions)) throw Error('Expected a discussion array');
  const changes = [];
  const ids = new Set();
  for (const post of discussions) {
    if (post.user?.login !== OWNER) continue;
    if (!Number.isSafeInteger(post.number) || post.number < 1 || ids.has(post.number)) throw Error('Invalid or duplicate discussion number');
    ids.add(post.number);
    if (typeof post.title !== 'string' || !post.title.trim() || typeof post.body !== 'string') throw Error(`Invalid discussion #${post.number}`);
    if (Number.isNaN(Date.parse(post.created_at)) || Number.isNaN(Date.parse(post.updated_at))) throw Error(`Invalid date #${post.number}`);
    if (!post.category?.name || !post.category?.slug) throw Error(`Missing category #${post.number}`);
    const url = `https://github.com/${REPOSITORY}/discussions/${post.number}`;
    const filename = path.join(postsDirectory, `${String(post.number).padStart(4, '0')}.md`);
    let old = null, previous = {};
    try {old = await readFile(filename, 'utf8'); previous = matter(old).data;} catch(error) {if(error.code !== 'ENOENT') throw error;}
    // Never replace an independently authored Markdown post with the same id.
    if (old !== null && previous.originalUrl !== url) throw Error(`Discussion #${post.number} conflicts with a manually written post`);
    const metadata = {
      id:post.number, title:post.title, date:post.created_at, updated:post.updated_at,
      category:post.category.name, categorySlug:post.category.slug, emoji:post.category.emoji || '💬',
      pinned:previous.pinned === true, originalUrl:url,
      ...(previous.draft === true ? {draft:true} : {}),
    };
    const next = '---\n' + Object.entries(metadata).map(([key,value]) => `${key}: ${JSON.stringify(value)}`).join('\n') + '\n---\n\n' + post.body.replace(/\r\n/g,'\n') + '\n';
    if(next !== old) changes.push({filename,content:next});
  }
  // Validate all records before modifying any files; unchanged files stay untouched.
  await mkdir(postsDirectory,{recursive:true});
  for (const change of changes) await writeFile(change.filename,change.content);
  return changes.map(change => path.basename(change.filename));
}

if(process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  if(process.env.GITHUB_REPOSITORY && process.env.GITHUB_REPOSITORY !== REPOSITORY) throw Error('Unexpected repository');
  const pages = JSON.parse(execFileSync('gh',['api','--paginate','--slurp',`repos/${REPOSITORY}/discussions?per_page=100`],{encoding:'utf8',maxBuffer:32*1024*1024}));
  const changed = await syncDiscussions(pages.flat());
  console.log(`Synced Discussions: ${changed.length} files updated${changed.length ? ` (${changed.join(', ')})` : ''}.`);
}
