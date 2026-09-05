# Atomic Design

- `atoms`: elemen UI terkecil, termasuk primitive dari shadcn/ui di `atoms/ui`.
- `molecules`: gabungan beberapa atom dengan satu tanggung jawab sederhana.
- `organisms`: bagian antarmuka yang tersusun dari atom dan molecule.
- `templates`: kerangka tata letak tanpa data halaman spesifik.
- `pages`: komposisi akhir template dan organism untuk sebuah route.

Pertahankan arah dependensi dari lapisan besar ke lapisan yang lebih kecil; atom tidak
boleh mengimpor molecule, organism, template, atau page.
