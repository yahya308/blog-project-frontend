import assert from 'node:assert/strict'
import { spawn } from 'node:child_process'
import { once } from 'node:events'
import { createServer } from 'node:http'
import { setTimeout } from 'node:timers/promises'
import { fileURLToPath } from 'node:url'
import test from 'node:test'

const siteUrl = 'https://yahyabaltaci.co'
const category = { id: 'web', name: 'Web', slug: 'web' }
const article = {
  id: 'article',
  slug: 'published-article',
  title: 'Published article',
  content: '<p>Published article content.</p>',
  excerpt: 'A published article.',
  coverImage: 'https://images.pexels.com/photos/1/pexels-photo-1.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200',
  authorName: 'Yahya Baltacı',
  status: 'YAYINDA',
  publishedAt: '2026-01-01T00:00:00.000Z',
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
  authorId: 'author',
  author: { id: 'author', name: 'Test author' },
  categories: [category]
}

function canonical(html) {
  return [...html.matchAll(/<link\b[^>]*>/g)]
    .filter(([tag]) => /rel="canonical"/.test(tag))
    .map(([tag]) => tag.match(/href="([^"]*)"/)?.[1].replaceAll('&amp;', '&'))
}

function jsonLd(html) {
  return [...html.matchAll(/<script\b[^>]*type="application\/ld\+json"[^>]*>(.*?)<\/script>/gs)]
    .map(([, json]) => JSON.parse(json))
}

function meta(html, key) {
  return [...html.matchAll(/<meta\b[^>]*>/g)]
    .filter(([tag]) => tag.includes(`"${key}"`))
    .map(([tag]) => tag.match(/content="([^"]*)"/)?.[1].replaceAll('&amp;', '&'))
}

test('production HTTP responses preserve SEO and error semantics', { timeout: 60000 }, async (t) => {
  let listUnavailable = false
  const api = createServer((request, response) => {
    const path = new URL(request.url, 'http://localhost').pathname
    response.setHeader('Content-Type', 'application/json')

    if (path === '/api/blogs') {
      response.statusCode = listUnavailable ? 503 : 200
      response.end(JSON.stringify({ success: !listUnavailable, blogs: [article] }))
    } else if (path === '/api/blogs/published-article') {
      response.end(JSON.stringify({ success: true, blog: article }))
    } else if (path === '/api/blogs/draft-article') {
      response.end(JSON.stringify({ success: true, blog: { ...article, status: 'TASLAK' } }))
    } else {
      response.statusCode = path === '/api/blogs/unavailable' ? 503 : path === '/api/blogs/server-error' ? 500 : 404
      response.end(JSON.stringify({ success: false, message: 'Upstream response' }))
    }
  })
  api.listen(0, '127.0.0.1')
  await once(api, 'listening')
  t.after(() => new Promise(resolve => api.close(resolve)))
  const apiUrl = `http://127.0.0.1:${api.address().port}`

  // Reserve an available port for the built Nuxt server.
  const portProbe = createServer()
  portProbe.listen(0, '127.0.0.1')
  await once(portProbe, 'listening')
  const port = portProbe.address().port
  await new Promise(resolve => portProbe.close(resolve))

  const server = spawn(process.execPath, ['.output/server/index.mjs'], {
    cwd: fileURLToPath(new URL('../', import.meta.url)),
    windowsHide: true,
    env: {
      ...process.env,
      NODE_ENV: 'production',
      NITRO_HOST: '127.0.0.1',
      NITRO_PORT: String(port),
      NUXT_BACKEND_ORIGIN: apiUrl,
      NUXT_PUBLIC_API_BASE: `${apiUrl}/api`
    },
    stdio: ['ignore', 'pipe', 'pipe']
  })
  let logs = ''
  server.stdout.on('data', chunk => logs += chunk)
  server.stderr.on('data', chunk => logs += chunk)
  t.after(async () => {
    if (server.exitCode === null) {
      const exited = once(server, 'exit')
      server.kill()
      await exited
    }
  })

  const base = `http://127.0.0.1:${port}`
  const fetchPage = (path, options = {}) => fetch(`${base}${path}`, {
    ...options,
    headers: { accept: 'text/html', ...(options.headers ?? {}) }
  })
  let ready = false
  for (let attempt = 0; attempt < 100; attempt++) {
    assert.equal(server.exitCode, null, logs)
    try {
      const response = await fetchPage('/hakkimda')
      await response.text()
      ready = true
      break
    } catch {
      await setTimeout(100)
    }
  }
  assert.ok(ready, `Nuxt server did not start. ${logs}`)

  await t.test('public pages use one production canonical and remove tracking parameters', async () => {
    for (const path of ['/', '/blogs', '/hakkimda', '/blogs/published-article']) {
      const response = await fetchPage(`${path}?utm_source=test&gclid=test`)
      assert.equal(response.status, 200, path)
      const html = await response.text()
      assert.deepEqual(canonical(html), [`${siteUrl}${path}`], path)
      if (path.endsWith('published-article')) assert.match(html, /Published article content\./)
    }
  })

  await t.test('pages have descriptive titles and structured data', async () => {
    const home = await (await fetchPage('/')).text()
    assert.match(home, /<title>Yahya Baltacı \| Teknoloji, yaşam ve seyahat üzerine yazılar<\/title>/)
    assert.equal(jsonLd(home)[0]['@type'], 'WebSite')

    const about = await (await fetchPage('/hakkimda')).text()
    assert.match(about, /<title>Hakkımda \| Yahya Baltacı<\/title>/)
    assert.equal(jsonLd(about)[0].mainEntity.url, `${siteUrl}/hakkimda`)

    const archive = await (await fetchPage('/blogs')).text()
    assert.match(archive, /<title>Tüm Yazılar: Teknoloji, Yaşam ve Seyahat \| Yahya Baltacı<\/title>/)

    const html = await (await fetchPage('/blogs/published-article')).text()
    assert.match(html, /<title>Published article \| Yahya Baltacı<\/title>/)
    const [posting] = jsonLd(html)
    assert.equal(posting['@type'], 'BlogPosting')
    assert.equal(posting.mainEntityOfPage, `${siteUrl}/blogs/published-article`)
    assert.equal(posting.datePublished, article.publishedAt)
    assert.equal(posting.author.url, `${siteUrl}/hakkimda`)
    assert.deepEqual(posting.image, [article.coverImage])
    assert.match(html, /rel="author"/)
  })

  await t.test('articles share their cover image and serve resized Pexels variants', async () => {
    const html = await (await fetchPage('/blogs/published-article')).text()
    assert.deepEqual(meta(html, 'og:image'), [article.coverImage])
    assert.deepEqual(meta(html, 'twitter:image'), [])
    assert.deepEqual(meta(html, 'article:published_time'), [article.publishedAt])
    assert.match(html, /h=334&amp;w=640 640w/)
  })

  await t.test('sitemap lists published articles', async () => {
    const response = await fetchPage('/sitemap.xml')
    assert.equal(response.status, 200)
    assert.match(await response.text(), new RegExp(`<loc>${siteUrl}/blogs/published-article</loc>`))
  })

  await t.test('category content keeps its own canonical', async () => {
    const response = await fetchPage('/blogs?utm_source=test&category=web')
    assert.equal(response.status, 200)
    assert.deepEqual(canonical(await response.text()), [`${siteUrl}/blogs?category=web`])
  })

  await t.test('trailing slashes redirect permanently and retain the query string', async () => {
    for (const path of ['/blogs/', '/hakkimda/', '/blogs/published-article/']) {
      for (const method of ['GET', 'HEAD']) {
        const response = await fetchPage(`${path}?category=web&utm_source=test`, { method, redirect: 'manual' })
        assert.equal(response.status, 308, `${method} ${path}`)
        assert.equal(response.headers.get('location'), `${path.slice(0, -1)}?category=web&utm_source=test`)
        await response.text()
      }
    }
  })

  await t.test('missing and unpublished articles return 404 without a canonical', async () => {
    for (const path of ['/blogs/missing', '/blogs/draft-article', '/missing-page']) {
      const response = await fetchPage(path)
      assert.equal(response.status, 404, path)
      const html = await response.text()
      assert.match(html, /Sayfa bulunamadı/)
      assert.match(html, /name="robots" content="noindex, follow"/)
      assert.deepEqual(canonical(html), [])
    }
  })

  await t.test('temporary upstream failures stay 5xx instead of becoming missing articles', async () => {
    for (const [slug, status] of [['unavailable', 503], ['server-error', 500]]) {
      const response = await fetchPage(`/blogs/${slug}`)
      assert.equal(response.status, status)
      const html = await response.text()
      assert.match(html, /Sayfa yüklenemedi/)
      assert.deepEqual(canonical(html), [])
    }
  })

  await t.test('recommendation failures do not hide an existing article', async () => {
    listUnavailable = true
    const response = await fetchPage('/blogs/published-article')
    assert.equal(response.status, 200)
    const html = await response.text()
    assert.match(html, /Published article content\./)
    assert.deepEqual(canonical(html), [`${siteUrl}/blogs/published-article`])
    listUnavailable = false
  })

  await t.test('admin pages do not receive public canonical tags', async () => {
    const response = await fetchPage('/admin/login')
    assert.equal(response.status, 200)
    assert.deepEqual(canonical(await response.text()), [])
  })
})
