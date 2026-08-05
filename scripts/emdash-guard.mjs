// The prose em-dash guard (TODO.FULL/09): fails when an em-dash appears
// outside a code fence in public copy (mdx/md/astro). Code comments are
// internal by the documented classification and are not scanned.
import { readFileSync } from 'node:fs'
import { globSync } from 'node:fs'
import { execSync } from 'node:child_process'

const files = execSync('git ls-files "src/**/*.mdx" "src/**/*.md" "src/**/*.astro"', { encoding: 'utf8' })
  .trim().split('\n').filter(Boolean)

const violations = []
for (const f of files) {
  const lines = readFileSync(f, 'utf8').split('\n')
  let inFence = false
  lines.forEach((line, i) => {
    if (line.trimStart().startsWith('```')) { inFence = !inFence; return }
    if (inFence) return
    // prose only: skip comment lines (// and /* */ and JSDoc) and frontmatter-free code
    const t = line.trimStart()
    if (t.startsWith('//') || t.startsWith('*') || t.startsWith('/*')) return
    if (line.includes('—')) violations.push(`${f}:${i + 1}: ${line.trim().slice(0, 100)}`)
  })
}

if (violations.length) {
  console.error(`em-dash in public copy (${violations.length}):`)
  for (const v of violations) console.error('  ' + v)
  process.exit(1)
}
console.log('no em-dashes in public copy')
