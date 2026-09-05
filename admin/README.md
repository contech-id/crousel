# Crousel Admin

Admin dashboard React/Vite untuk mengelola katalog produk dan customer Crousel.

## Menjalankan

```bash
npm install
npm run dev
```

Login demo:

- Email: `admin@crousel.id`
- Password: `admin123`

Client API memakai `http://localhost:8000/api/v1` secara default. Jika endpoint tulis produk atau endpoint customer membutuhkan token Sanctum, buat file `.env` di folder `admin`:

```env
VITE_API_URL=http://localhost:8000/api/v1
VITE_API_TOKEN=1|token-dari-endpoint-login
```

Token tersebut dipakai untuk request API yang membutuhkan Bearer selama development.
