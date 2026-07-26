# Blog Frontend

Yahya Baltacı kişisel blog sitesinin Nuxt frontend uygulaması.

Canlı site: [yahyabaltaci.co](https://yahyabaltaci.co)

## Özellikler

- Ana sayfa, yazı listesi, yazı detayı ve hakkımda sayfaları
- Admin paneli (giriş, dashboard, yazı/kategori yönetimi, taslaklar)
- SSR ile API erişimi
- `@nuxt/image` ile görsel optimizasyonu
- Sitemap, robots.txt ve Vercel Analytics
- Açık/koyu tema

## Teknolojiler

- Nuxt 4
- Nuxt UI + Tailwind CSS
- Pinia
- TypeScript
- Vercel

## Gereksinimler

- Node.js 22.x
- npm

## Kurulum

```bash
npm install
```

`.env` dosyası oluştur:

```env
NUXT_PUBLIC_API_BASE=http://localhost:5000/api
NUXT_BACKEND_ORIGIN=http://localhost:5000
```

| Değişken | Açıklama |
|---|---|
| `NUXT_PUBLIC_API_BASE` | Tarayıcıdan kullanılan API adresi |
| `NUXT_BACKEND_ORIGIN` | SSR sırasında kullanılan backend origin (`/api` olmadan) |

## Geliştirme

```bash
npm run dev
```

Uygulama varsayılan olarak `http://localhost:3000` adresinde açılır.

## Scriptler

| Komut | Açıklama |
|---|---|
| `npm run dev` | Geliştirme sunucusu |
| `npm run build` | Production build |
| `npm run preview` | Build önizleme |
| `npm run start` | Production sunucusu |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript kontrolü |

## Production ortam değişkenleri

Vercel (veya benzeri) üzerinde en az şunları tanımla:

```env
NUXT_PUBLIC_API_BASE=https://api.yahyabaltaci.co/api
NUXT_BACKEND_ORIGIN=https://api.yahyabaltaci.co
```

## Proje yapısı

```text
app/
  components/   # UI bileşenleri
  composables/  # API ve auth yardımcıları
  pages/        # Rotalar (public + admin)
  utils/        # Ortak yardımcılar
public/         # Statik dosyalar
server/         # Nitro sunucu rotaları (sitemap)
```

## İlişkili repo

Backend: [blog-project-backend](https://github.com/yahya308/blog-project-backend)
