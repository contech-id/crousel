import { useEffect, useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import * as React from 'react'
import './App.css'

type Page = 'home' | 'customers' | 'products' | 'settings' | 'account'
type Product = {
  id: number; slug: string; name: string; category: string; target: string; color: string
  availableColors: string[]; images: string[]; description: string; price: string
  features: string[]; availableSizes: string[]; availability: string
}
type Customer = { id: number; name: string; whatsapp: string; created_at: string; province?: string | null }
type ProductForm = Omit<Product, 'id' | 'images'> & { images: File[]; existingImages: string[]; deletedImages: string[] }
type StoreProfile = { store_name: string; store_email: string; whatsapp: string; province: string; regency: string; district: string; village: string; postal_code: string; address: string; location_landmark?: string | null }
type ShippingMethod = { id: number; code: string; name: string; provider?: string; is_active: boolean }
type PaymentMethod = { id: number; code: string; name: string; type: string; is_active: boolean }
type NotificationSettings = { new_customer: boolean; new_order: boolean }
type AdminNotification = { id: number; type: string; title: string; message: string; read_at?: string | null; created_at: string }
type AdminAccount = { id: number; name: string; username: string; phone?: string | null; email: string; role: string; is_active: boolean }

const API_BASE = import.meta.env.VITE_API_URL
const emptyProduct: ProductForm = { slug: '', name: '', category: 'Slide', target: 'Women', color: '', availableColors: [], images: [], existingImages: [], deletedImages: [], description: '', price: '', features: [], availableSizes: [], availability: 'Tersedia' }

function slugify(value: string) {
  return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
}

async function apiRequest<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = sessionStorage.getItem('admin_api_token') ?? import.meta.env.VITE_API_TOKEN
  const isFormData = options.body instanceof FormData
  const response = await fetch(`${API_BASE}${path}`, { ...options, headers: { Accept: 'application/json', ...(isFormData ? {} : { 'Content-Type': 'application/json' }), ...(token ? { Authorization: `Bearer ${token}` } : {}), ...options.headers } })
  const payload = await response.json().catch(() => ({}))
  if (!response.ok) throw new Error(payload.message ?? `API error (${response.status})`)
  return payload as T
}

function App() {
  const [authenticated, setAuthenticated] = useState(() => sessionStorage.getItem('admin_authenticated') === 'true' && Boolean(sessionStorage.getItem('admin_api_token')))
  const [page, setPage] = useState<Page>(() => (window.location.hash.slice(1) as Page) || 'home')
  useEffect(() => { const onHashChange = () => setPage((window.location.hash.slice(1) as Page) || 'home'); window.addEventListener('hashchange', onHashChange); return () => window.removeEventListener('hashchange', onHashChange) }, [])
  const navigate = (nextPage: Page) => { window.location.hash = nextPage }
  const login = () => { sessionStorage.setItem('admin_authenticated', 'true'); setAuthenticated(true); navigate('home') }
  const logout = () => { sessionStorage.removeItem('admin_authenticated'); sessionStorage.removeItem('admin_api_token'); setAuthenticated(false) }
  if (!authenticated) return <LoginPageEnhanced onLogin={login} />
  return <AdminShellEnhanced page={page} onNavigate={navigate} onLogout={logout} />
}

function LoginPageEnhanced({ onLogin }: { onLogin: () => void }) {
  const [email, setEmail] = useState(''); const [password, setPassword] = useState(''); const [error, setError] = useState(''); const [loading, setLoading] = useState(false)
  const submit = async (event: FormEvent) => { event.preventDefault(); setLoading(true); setError(''); try { const response = await fetch(`${API_BASE}/admin/auth/login`, { method: 'POST', headers: { Accept: 'application/json', 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password }) }); const payload = await response.json().catch(() => ({})); if (!response.ok) throw new Error(payload.message ?? 'Login admin gagal.'); sessionStorage.setItem('admin_api_token', payload.data.token); onLogin() } catch (requestError) { setError(requestError instanceof Error ? requestError.message : 'Login admin gagal.') } finally { setLoading(false) } }
  return <main className="login-page"><div className="login-art" aria-hidden="true"><div className="art-orb orb-one" /><div className="art-orb orb-two" /><p className="art-wordmark">CROUSEL<span>.</span></p><p className="art-caption">YOUR HAPPINESS STUFF</p></div><section className="login-panel"><div className="login-content"><p className="eyebrow">Admin workspace</p><h1>Selamat datang kembali.</h1><p className="muted">Masuk dengan akun admin untuk mengelola Crousel.</p><form onSubmit={(event) => void submit(event)} className="login-form"><label>Email<input type="email" required value={email} onChange={(event) => setEmail(event.target.value)} placeholder="admin@crousel.id" /></label><label>Password<input type="password" required value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Masukkan password" /></label>{error && <p className="form-error" role="alert">{error}</p>}<button className="primary-button" type="submit" disabled={loading}>{loading ? 'Memproses...' : 'Masuk ke dashboard'}</button></form><div className="demo-hint"><span className="hint-dot" /> Demo: <strong>admin@crousel.id</strong> · <strong>admin123</strong></div></div></section></main>
}

function AdminShellEnhanced({ page, onNavigate, onLogout }: { page: Page; onNavigate: (page: Page) => void; onLogout: () => void }) {
  const [mobileSidebar, setMobileSidebar] = useState(false); const [notifications, setNotifications] = useState<AdminNotification[]>([]); const [showNotifications, setShowNotifications] = useState(false)
  const nav = (nextPage: Page) => { onNavigate(nextPage); setMobileSidebar(false) }
  useEffect(() => { void apiRequest<{ data: { notifications: AdminNotification[] } }>('/notifications').then((result) => setNotifications(result.data.notifications)).catch(() => undefined) }, [])
  const unread = notifications.filter((item) => !item.read_at).length
  const markRead = async (item: AdminNotification) => { if (item.read_at) return; await apiRequest(`/notifications/${item.id}/read`, { method: 'PATCH' }).catch(() => undefined); setNotifications((items) => items.map((current) => current.id === item.id ? { ...current, read_at: new Date().toISOString() } : current)) }
  const title = page === 'home' ? 'Overview' : page === 'products' ? 'Product catalogue' : page === 'customers' ? 'Customer directory' : page === 'account' ? 'Akun admin' : 'Pengaturan toko'
  return <div className="admin-shell"><aside className={`sidebar ${mobileSidebar ? 'sidebar-open' : ''}`}><div className="sidebar-brand"><span className="brand-mark">C</span><span><strong>CROUSEL</strong><small>Admin workspace</small></span><button className="icon-button sidebar-close" onClick={() => setMobileSidebar(false)} aria-label="Tutup sidebar">x</button></div><p className="nav-label">Workspace</p><nav className="sidebar-nav"><NavItem icon="H" label="Home" active={page === 'home'} onClick={() => nav('home')} /><NavItem icon="U" label="Users / Customer" active={page === 'customers'} onClick={() => nav('customers')} /><NavItem icon="P" label="Produk" active={page === 'products'} onClick={() => nav('products')} /><NavItem icon="S" label="Pengaturan" active={page === 'settings'} onClick={() => nav('settings')} /><NavItem icon="A" label="Akun admin" active={page === 'account'} onClick={() => nav('account')} /></nav><div className="sidebar-bottom"><div className="admin-mini"><span className="avatar">A</span><span><strong>Admin Crousel</strong><small>Administrator</small></span></div><button className="logout-button" onClick={onLogout}>Keluar</button></div></aside>{mobileSidebar && <button className="sidebar-backdrop" onClick={() => setMobileSidebar(false)} aria-label="Tutup menu" />}<div className="content-shell"><header className="topbar"><button className="menu-toggle" onClick={() => setMobileSidebar(true)} aria-label="Buka menu">=</button><div><p className="topbar-kicker">Crousel Official</p><p className="topbar-title">{title}</p></div><div className="topbar-actions"><span className="status-pill"><i /> API workspace</span><div className="notification-wrap"><button className="notification-button" onClick={() => setShowNotifications((value) => !value)} aria-label="Notifikasi">Bell {unread > 0 && <b>{unread}</b>}</button>{showNotifications && <div className="notification-popover"><strong>Notifikasi</strong>{notifications.length === 0 ? <small>Belum ada notifikasi.</small> : notifications.map((item) => <button className={`notification-item ${item.read_at ? 'read' : ''}`} key={item.id} onClick={() => void markRead(item)}><strong>{item.title}</strong><small>{item.message}</small><em>{new Date(item.created_at).toLocaleString('id-ID')}</em></button>)}</div>}</div><span className="topbar-avatar">A</span></div></header><main className="page-content">{page === 'home' && <HomePage onNavigate={onNavigate} />}{page === 'products' && <ProductsPage />}{page === 'customers' && <CustomersPage />}{page === 'settings' && <SettingsPage />}{page === 'account' && <AccountPage />}</main></div></div>
}

function NavItem({ icon, label, active, onClick }: { icon: string; label: string; active: boolean; onClick: () => void }) { return <button className={`nav-item ${active ? 'active' : ''}`} onClick={onClick}><span className="nav-icon">{icon}</span>{label}<span className="nav-arrow">›</span></button> }

function HomePage({ onNavigate }: { onNavigate: (page: Page) => void }) {
  const [products, setProducts] = useState<Product[]>([]); const [customers, setCustomers] = useState<Customer[]>([])
  useEffect(() => { void Promise.all([apiRequest<{ data: Product[] }>('/products'), apiRequest<{ data: Customer[] }>('/users')]).then(([productData, customerData]) => { setProducts(productData.data); setCustomers(customerData.data) }).catch(() => undefined) }, [])
  const months = ['OKT', 'NOV', 'DES', 'JAN', 'FEB', 'MAR', 'APR', 'MEI', 'JUN', 'JUL', 'AGT', 'SEP']
  return <div className="home-dashboard"><section className="home-stat-grid"><HomeStat label="Pendapatan" value="Rp 0" note="dari pesanan dibayar" tone="blue" /><HomeStat label="Pesanan" value="0" note="pesanan non-batal" tone="pink" /><HomeStat label="Produk aktif" value={String(products.length)} note="siap ditampilkan" tone="orange" /><HomeStat label="Pelanggan" value={String(customers.length)} note="sudah bertransaksi" tone="blue" /></section><section className="home-main-grid"><article className="panel performance-card"><div className="home-panel-heading"><div><h2>Performa 12 bulan</h2><p>Nilai transaksi dari pesanan yang telah dibayar.</p></div><span className="year-pill">2026</span></div><div className="chart-area">{months.map((month) => <div className="chart-column" key={month}><strong>0</strong><div className="chart-bar" /><small>{month}</small></div>)}</div></article><article className="panel category-card"><h2>Kategori teratas</h2><p className="empty-home-text">{products.length ? 'Kategori produk akan tampil setelah ada transaksi.' : 'Belum ada data produk terjual.'}</p></article></section><article className="panel orders-card"><div className="home-panel-heading"><h2>Pesanan terbaru</h2><button className="link-button" onClick={() => onNavigate('customers')}>Lihat semua</button></div><div className="orders-table"><div className="orders-head"><span>ID</span><span>PELANGGAN</span><span>PRODUK</span><span>TOTAL</span><span>STATUS</span></div><div className="orders-empty">Belum ada pesanan terbaru.</div></div></article></div>
}
function HomeStat({ label, value, note, tone }: { label: string; value: string; note: string; tone: string }) { return <article className="home-stat"><div className={`stat-dot ${tone}`} /><p>{label}</p><strong>{value}</strong><small>↗ {note}</small></article> }

function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]); const [query, setQuery] = useState(''); const [loading, setLoading] = useState(true); const [error, setError] = useState(''); const [editing, setEditing] = useState<Product | null>(null); const [showForm, setShowForm] = useState(false)
  const load = async () => { setLoading(true); try { const result = await apiRequest<{ data: Product[] }>('/products'); setProducts(result.data); setError('') } catch (requestError) { setError(requestError instanceof Error ? requestError.message : 'Tidak dapat memuat produk.') } finally { setLoading(false) } }
  useEffect(() => { const timer = window.setTimeout(() => { void load() }, 0); return () => window.clearTimeout(timer) }, [])
  const filtered = useMemo(() => products.filter((product) => `${product.name} ${product.category}`.toLowerCase().includes(query.toLowerCase())), [products, query])
  const remove = async (product: Product) => { if (!window.confirm(`Hapus ${product.name}?`)) return; try { await apiRequest(`/products/${product.id}`, { method: 'DELETE' }); setProducts((items) => items.filter((item) => item.id !== product.id)); setError('') } catch (requestError) { setError(requestError instanceof Error ? requestError.message : 'Produk gagal dihapus.') } }
  return <><div className="page-heading"><div><p className="eyebrow">Catalog management</p><h1>Produk</h1><p className="muted">Kelola semua produk yang tampil di katalog Crousel.</p></div><button className="primary-button compact" onClick={() => { setEditing(null); setShowForm(true) }}>+ Tambah produk</button></div><section className="panel table-panel"><div className="table-toolbar"><div className="search-field"><span>⌕</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Cari nama atau kategori..." /></div><button className="outline-button" onClick={() => void load()}>Refresh ↻</button></div>{error && <div className="api-error">{error} <small>Pastikan backend berjalan di {API_BASE}.</small></div>}{loading ? <Loading /> : filtered.length ? <div className="table-scroll"><table><thead><tr><th>Produk</th><th>Kategori</th><th>Target</th><th>Harga</th><th>Status</th><th aria-label="Aksi" /></tr></thead><tbody>{filtered.map((product) => <tr key={product.id}><td><div className="product-cell"><div className="product-thumb">{product.images?.[0] ? <img src={product.images[0]} alt="" /> : <span>□</span>}</div><span><strong>{product.name}</strong><small>{product.slug}</small></span></div></td><td>{product.category}</td><td>{product.target}</td><td className="price-cell">{product.price}</td><td><span className={`availability ${product.availability === 'Tersedia' ? 'available' : ''}`}>{product.availability}</span></td><td><div className="row-actions"><button onClick={() => { setEditing(product); setShowForm(true) }} aria-label={`Edit ${product.name}`}>Edit</button><button className="danger-text" onClick={() => void remove(product)} aria-label={`Hapus ${product.name}`}>Hapus</button></div></td></tr>)}</tbody></table></div> : <EmptyState message="Belum ada produk di database." />}</section>{showForm && <ProductModal product={editing} onClose={() => setShowForm(false)} onSaved={(product) => { setProducts((items) => editing ? items.map((item) => item.id === product.id ? product : item) : [product, ...items]); setShowForm(false) }} />}</>
}

function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]); const [query, setQuery] = useState(''); const [loading, setLoading] = useState(true); const [error, setError] = useState('')
  useEffect(() => { void apiRequest<{ data: Customer[] }>('/users').then((result) => setCustomers(result.data)).catch((requestError) => setError(requestError instanceof Error ? requestError.message : 'Tidak dapat memuat customer.')).finally(() => setLoading(false)) }, [])
  const filtered = customers.filter((customer) => `${customer.name} ${customer.whatsapp}`.toLowerCase().includes(query.toLowerCase()))
  return <><div className="page-heading"><div><p className="eyebrow">Customer directory</p><h1>Users / Customer</h1><p className="muted">Lihat customer yang terdaftar melalui API Crousel.</p></div><span className="count-badge">{customers.length} customer</span></div><section className="panel table-panel"><div className="table-toolbar"><div className="search-field"><span>⌕</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Cari nama atau WhatsApp..." /></div></div>{error && <div className="api-error">{error} <small>Endpoint customer membutuhkan akses API Bearer.</small></div>}{loading ? <Loading /> : filtered.length ? <div className="table-scroll"><table><thead><tr><th>Customer</th><th>WhatsApp</th><th>Provinsi</th><th>Terdaftar</th><th>Status</th></tr></thead><tbody>{filtered.map((customer) => <tr key={customer.id}><td><div className="customer-cell"><span className="customer-avatar">{customer.name.charAt(0).toUpperCase()}</span><strong>{customer.name}</strong></div></td><td>{customer.whatsapp}</td><td>{customer.province ?? '—'}</td><td>{new Date(customer.created_at).toLocaleDateString('id-ID')}</td><td><span className="availability available">Aktif</span></td></tr>)}</tbody></table></div> : <EmptyState message="Belum ada customer yang tersimpan." />}</section></>
}

type SettingsTab = 'profile' | 'shipping' | 'payments' | 'notifications' | 'account'

function SettingsPage() {
  const [tab, setTab] = useState<SettingsTab>('profile'); const [profile, setProfile] = useState<StoreProfile | null>(null); const [shipping, setShipping] = useState<ShippingMethod[]>([]); const [payments, setPayments] = useState<PaymentMethod[]>([]); const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({ new_customer: true, new_order: true }); const [loading, setLoading] = useState(true); const [message, setMessage] = useState('')
  const [accountState, setAccountState] = useState<AdminAccount>({ id: 0, name: '', username: '', phone: '', email: '', role: 'admin', is_active: true })
  useEffect(() => { void Promise.all([apiRequest<{ data: { profile: StoreProfile; shipping: ShippingMethod[]; payments: PaymentMethod[]; notifications: NotificationSettings } }>('/settings'), apiRequest<{ data: { admin: AdminAccount } }>('/admin/account')]).then(([settings, account]) => { setProfile(settings.data.profile); setShipping(settings.data.shipping); setPayments(settings.data.payments); setNotificationSettings(settings.data.notifications); setAccountState(account.data.admin) }).catch((error) => setMessage(error instanceof Error ? error.message : 'Pengaturan gagal dimuat.')).finally(() => setLoading(false)) }, [])
  if (loading || !profile) return <Loading />
  return <><div className="page-heading"><div><p className="eyebrow">Store configuration</p><h1>Pengaturan</h1><p className="muted">Atur identitas toko, layanan checkout, notifikasi, dan akun admin.</p></div></div>{message && <div className="api-success">{message}</div>}<SettingsLayout activeTab={tab} onTabChange={setTab} profile={profile}>{tab === 'profile' && <ProfileContent profile={profile} onSaved={(next) => setProfile(next)} onMessage={setMessage} />}{tab === 'shipping' && <SettingsList title="Pengiriman RajaOngkir" description="Aktifkan jasa kirim yang tersedia dari konfigurasi RajaOngkir toko." items={shipping} onToggle={async (item) => { const result = await apiRequest<{ data: { shipping: ShippingMethod } }>(`/settings/shipping/${item.id}`, { method: 'PATCH', body: JSON.stringify({ is_active: !item.is_active }) }); setShipping((items) => items.map((current) => current.id === item.id ? result.data.shipping : current)) }} />}{tab === 'payments' && <SettingsList title="Metode pembayaran Midtrans" description="Aktifkan kanal pembayaran yang tersedia di checkout." items={payments} onToggle={async (item) => { const result = await apiRequest<{ data: { payment: PaymentMethod } }>(`/settings/payments/${item.id}`, { method: 'PATCH', body: JSON.stringify({ is_active: !item.is_active }) }); setPayments((items) => items.map((current) => current.id === item.id ? result.data.payment : current)) }} />}{tab === 'notifications' && <NotificationContent settings={notificationSettings} onChange={setNotificationSettings} onMessage={setMessage} />}{tab === 'account' && <AccountContent account={accountState} onAccountChange={setAccountState} onMessage={setMessage} />}</SettingsLayout></>
}

function SettingsLayout({ activeTab, onTabChange, profile, children }: { activeTab: SettingsTab; onTabChange: (tab: SettingsTab) => void; profile: StoreProfile; children: React.ReactNode }) { const tabs: Array<[SettingsTab, string]> = [['profile', 'Profil toko'], ['shipping', 'Pengiriman'], ['payments', 'Pembayaran'], ['notifications', 'Notifikasi'], ['account', 'Akun admin']]; return <><nav className="settings-pill-nav">{tabs.map(([key, label]) => <button key={key} className={activeTab === key ? 'active' : ''} onClick={() => onTabChange(key)}>{label}</button>)}</nav><div className="settings-content-grid"><section className="panel settings-main-panel">{children}</section><aside className="panel store-summary"><h2>Ringkasan toko</h2><SummaryItem label="Toko" value={profile.store_name || 'Belum diatur'} /><SummaryItem label="Lokasi" value={[profile.regency, profile.province].filter(Boolean).join(', ') || 'Belum diatur'} /><SummaryItem label="WhatsApp" value={profile.whatsapp || 'Belum diatur'} /><SummaryItem label="Zona waktu" value="WIB (GMT+7)" /></aside></div></> }
function SummaryItem({ label, value }: { label: string; value: string }) { return <div className="summary-item"><small>{label}</small><strong>{value}</strong></div> }
function ProfileContent({ profile, onSaved, onMessage }: { profile: StoreProfile; onSaved: (profile: StoreProfile) => void; onMessage: (message: string) => void }) { const [form, setForm] = useState(profile); const update = (key: keyof StoreProfile, value: string) => setForm((current) => ({ ...current, [key]: value })); const save = async (event: FormEvent) => { event.preventDefault(); try { const result = await apiRequest<{ data: { profile: StoreProfile } }>('/settings/profile', { method: 'PUT', body: JSON.stringify(form) }); onSaved(result.data.profile); onMessage('Profil toko berhasil disimpan.') } catch (error) { onMessage(error instanceof Error ? error.message : 'Profil gagal disimpan.') } }; return <form className="product-form settings-form" onSubmit={(event) => void save(event)}><h2>Profil toko</h2><div className="form-grid"><Field label="Nama toko" value={form.store_name} onChange={(value) => update('store_name', value)} required /><Field label="Email toko" value={form.store_email} onChange={(value) => update('store_email', value)} required /><Field label="Nomor WhatsApp" value={form.whatsapp} onChange={(value) => update('whatsapp', value)} required /><Field label="Kode pos" value={form.postal_code} onChange={(value) => update('postal_code', value)} required /><Field label="Provinsi" value={form.province} onChange={(value) => update('province', value)} required /><Field label="Kota/Kabupaten" value={form.regency} onChange={(value) => update('regency', value)} required /><Field label="Kecamatan" value={form.district} onChange={(value) => update('district', value)} required /><Field label="Kelurahan/Desa" value={form.village} onChange={(value) => update('village', value)} required /></div><label>Alamat lengkap<textarea required rows={3} value={form.address} onChange={(event) => update('address', event.target.value)} /></label><Field label="Patokan lokasi (opsional)" value={form.location_landmark ?? ''} onChange={(value) => update('location_landmark', value)} /><button className="primary-button" type="submit">Simpan profil</button></form> }
function NotificationContent({ settings, onChange, onMessage }: { settings: NotificationSettings; onChange: (settings: NotificationSettings) => void; onMessage: (message: string) => void }) { const save = async () => { await apiRequest('/settings/notifications', { method: 'PUT', body: JSON.stringify(settings) }); onMessage('Preferensi notifikasi berhasil disimpan.') }; return <div className="notification-settings settings-form"><h2>Notifikasi lonceng</h2><p className="muted">Atur aktivitas yang tampil pada lonceng admin.</p><ToggleRow label="Pelanggan baru" description="Tampil saat pelanggan menyelesaikan pendaftaran" active={settings.new_customer} onToggle={() => onChange({ ...settings, new_customer: !settings.new_customer })} /><ToggleRow label="Pesanan baru" description="Tampil saat pelanggan membuat pesanan" active={settings.new_order} onToggle={() => onChange({ ...settings, new_order: !settings.new_order })} /><button className="primary-button" onClick={() => void save()}>Simpan preferensi</button></div> }
function AccountContent({ account, onAccountChange, onMessage }: { account: AdminAccount; onAccountChange: (account: AdminAccount) => void; onMessage: (message: string) => void }) { const [password, setPassword] = useState(''); const save = async (event: FormEvent) => { event.preventDefault(); try { const result = await apiRequest<{ data: { admin: AdminAccount } }>('/admin/account', { method: 'PUT', body: JSON.stringify(account) }); onAccountChange(result.data.admin); onMessage('Detail akun berhasil disimpan.') } catch (error) { onMessage(error instanceof Error ? error.message : 'Akun gagal disimpan.') } }; const changePassword = async (event: FormEvent) => { event.preventDefault(); if (!password.trim()) { onMessage('Password tidak diubah.'); return } try { await apiRequest('/admin/account/password', { method: 'PUT', body: JSON.stringify({ password }) }); setPassword(''); onMessage('Password berhasil diubah.') } catch (error) { onMessage(error instanceof Error ? error.message : 'Password gagal diubah.') } }; return <div className="settings-form"><h2>Akun admin</h2><p className="muted">Kelola identitas dan keamanan akun administrator.</p><form className="product-form" onSubmit={(event) => void save(event)}><div className="form-grid"><Field label="Nama" value={account.name} onChange={(value) => onAccountChange({ ...account, name: value })} required /><Field label="Username" value={account.username} onChange={(value) => onAccountChange({ ...account, username: value })} required /><Field label="Nomor telepon" value={account.phone ?? ''} onChange={(value) => onAccountChange({ ...account, phone: value })} /><Field label="Email" value={account.email} onChange={(value) => onAccountChange({ ...account, email: value })} required /></div><button className="primary-button" type="submit">Simpan akun</button></form><form className="product-form password-form" onSubmit={(event) => void changePassword(event)}><h3>Password</h3><p className="muted">Kosongkan jika tidak ingin mengubah password.</p><Field label="Ubah password" value={password} onChange={setPassword} /><button className="outline-button" type="submit">Simpan password</button></form></div> }

function AccountPage() { return <section className="settings-layout account-layout"><div className="settings-tabs"><button onClick={() => { window.location.hash = 'settings' }}>Profil toko</button><button onClick={() => { window.location.hash = 'settings' }}>Pengiriman</button><button onClick={() => { window.location.hash = 'settings' }}>Pembayaran</button><button onClick={() => { window.location.hash = 'settings' }}>Notifikasi</button><button className="active">Akun admin <span aria-hidden="true">›</span></button></div><AccountFormPage /></section> }

function AccountFormPage() {
  const [account, setAccount] = useState<AdminAccount>({ id: 0, name: '', username: '', phone: '', email: '', role: 'admin', is_active: true }); const [newPassword, setNewPassword] = useState(''); const [message, setMessage] = useState('')
  useEffect(() => { void apiRequest<{ data: { admin: AdminAccount } }>('/admin/account').then((result) => setAccount(result.data.admin)).catch((error) => setMessage(error instanceof Error ? error.message : 'Akun gagal dimuat.')) }, [])
  const saveAccount = async (event: FormEvent) => { event.preventDefault(); try { const result = await apiRequest<{ data: { admin: AdminAccount } }>('/admin/account', { method: 'PUT', body: JSON.stringify(account) }); setAccount(result.data.admin); setMessage('Detail akun berhasil disimpan.') } catch (error) { setMessage(error instanceof Error ? error.message : 'Akun gagal disimpan.') } }
  const savePassword = async (event: FormEvent) => { event.preventDefault(); if (!newPassword.trim()) { setMessage('Password dibiarkan tanpa perubahan.'); return } try { await apiRequest('/admin/account/password', { method: 'PUT', body: JSON.stringify({ password: newPassword }) }); setNewPassword(''); setMessage('Password berhasil diubah.') } catch (error) { setMessage(error instanceof Error ? error.message : 'Password gagal diubah.') } }
  return <section className="panel account-panel"><div className="notification-settings"><p className="eyebrow">Admin account</p><h2>Akun admin</h2><p className="muted">Kelola identitas dan keamanan akun administrator.</p>{message && <div className="api-success">{message}</div>}<form className="product-form" onSubmit={(event) => void saveAccount(event)}><div className="form-grid"><Field label="Nama" value={account.name} onChange={(value) => setAccount((current) => ({ ...current, name: value }))} required /><Field label="Username" value={account.username} onChange={(value) => setAccount((current) => ({ ...current, username: value }))} required /><Field label="Nomor telepon" value={account.phone ?? ''} onChange={(value) => setAccount((current) => ({ ...current, phone: value }))} /><Field label="Email" value={account.email} onChange={(value) => setAccount((current) => ({ ...current, email: value }))} required /></div><button className="primary-button" type="submit">Simpan akun</button></form><form className="product-form password-form" onSubmit={(event) => void savePassword(event)}><h3>Password</h3><p className="muted">Kosongkan jika tidak ingin mengubah password.</p><Field label="Ubah password" value={newPassword} onChange={setNewPassword} /><button className="outline-button" type="submit">Simpan password</button></form></div></section>
}

function SettingsList({ title, description, items, onToggle }: { title: string; description: string; items: Array<ShippingMethod | PaymentMethod>; onToggle: (item: ShippingMethod | PaymentMethod) => void }) { return <div className="notification-settings"><p className="eyebrow">Configuration</p><h2>{title}</h2><p className="muted">{description}</p><div className="settings-list">{items.map((item) => <ToggleRow key={item.id} label={item.name} description={'type' in item ? item.type : item.provider ?? 'RajaOngkir'} active={item.is_active} onToggle={() => onToggle(item)} />)}</div></div> }
function ToggleRow({ label, description, active, onToggle }: { label: string; description: string; active: boolean; onToggle: () => void }) { return <div className="toggle-row"><div><strong>{label}</strong><small>{description}</small></div><button className={`switch ${active ? 'on' : ''}`} onClick={onToggle} role="switch" aria-checked={active}><span /></button></div> }

function ProductModal({ product, onClose, onSaved }: { product: Product | null; onClose: () => void; onSaved: (product: Product) => void }) {
  const [form, setForm] = useState<ProductForm>(product ? { ...product, availableColors: product.availableColors ?? [], images: [], existingImages: product.images ?? [], deletedImages: [], features: product.features ?? [], availableSizes: product.availableSizes ?? [] } : emptyProduct)
  const [error, setError] = useState('')
  const [previewUrls, setPreviewUrls] = useState<string[]>([])
  const [featureText, setFeatureText] = useState(() => (product?.features ?? []).join(', '))
  const [availableSizesText, setAvailableSizesText] = useState(() => (product?.availableSizes ?? []).join(', '))
  const update = <K extends keyof ProductForm>(key: K, value: ProductForm[K]) => setForm((current) => ({ ...current, [key]: value }))
  const text = (key: keyof ProductForm) => Array.isArray(form[key]) ? (form[key] as string[]).join(', ') : String(form[key] ?? '')
  const parseList = (value: string) => value.split(',').map((item) => item.trim()).filter(Boolean)

  const handleNameChange = (value: string) => { update('name', value); update('slug', slugify(value)) }
  const parsedColors = form.color.split(',').map((c) => c.trim()).filter(Boolean)
  const toggleColor = (color: string) => {
    const current = form.availableColors.map((c) => c.trim())
    if (current.includes(color)) { update('availableColors', current.filter((c) => c !== color)) } else { update('availableColors', [...current, color]) }
  }

  const handleImageChange = (files: FileList | null) => {
    const newFiles = Array.from(files ?? [])
    update('images', [...form.images, ...newFiles])
    setPreviewUrls([...previewUrls, ...newFiles.map((file) => URL.createObjectURL(file))])
  }

  const removeExistingImage = (index: number) => {
    const url = form.existingImages[index];
    update('existingImages', form.existingImages.filter((_, i) => i !== index));
    update('deletedImages', [...form.deletedImages, url]);
  }

  const removeNewImage = (index: number) => {
    URL.revokeObjectURL(previewUrls[index]);
    setPreviewUrls(previewUrls.filter((_, i) => i !== index));
    update('images', form.images.filter((_, i) => i !== index));
  }

  const submit = async (event: FormEvent) => {
    event.preventDefault(); setError('')
    if (form.existingImages.length === 0 && form.images.length === 0) {
      setError('Produk harus memiliki setidaknya 1 gambar.'); return
    }
    const body = new FormData()
    if (product) body.append('_method', 'PATCH')
    const arrays: (keyof ProductForm)[] = ['availableColors', 'features', 'availableSizes']
    arrays.forEach((key) => text(key).split(',').map((item) => item.trim()).filter(Boolean).forEach((item) => body.append(`${key}[]`, item)))
    const skipKeys: (keyof ProductForm)[] = [...arrays, 'images', 'existingImages', 'deletedImages']
    ;(Object.keys(form) as (keyof ProductForm)[]).filter((key) => !skipKeys.includes(key) && form[key] !== null && form[key] !== undefined).forEach((key) => body.append(key, String(form[key])))
    form.images.forEach((image) => body.append('images[]', image))
    form.deletedImages.forEach((url) => body.append('deletedImages[]', url))
    try { const result = await apiRequest<{ data: { product: Product } }>(product ? `/products/${product.id}` : '/products', { method: 'POST', body }); onSaved(result.data.product) } catch (requestError) { setError(requestError instanceof Error ? requestError.message : 'Produk gagal disimpan.') }
  }

  return <div className="modal-backdrop" role="presentation"><section className="modal" role="dialog" aria-modal="true" aria-labelledby="product-modal-title"><div className="modal-heading"><div><p className="eyebrow">Catalog</p><h2 id="product-modal-title">{product ? 'Edit produk' : 'Tambah produk'}</h2></div><button className="icon-button" onClick={onClose} aria-label="Tutup">×</button></div><form onSubmit={(e) => void submit(e)} className="product-form">
    <div className="form-grid">
      <Field label="Nama produk" value={form.name} onChange={handleNameChange} required />
      <Field label="Slug" value={form.slug} onChange={(value) => update('slug', value)} required />
      <SelectField label="Kategori" value={form.category} options={['Slide', 'Slop', 'Wedges']} onChange={(value) => update('category', value)} />
      <Field label="Harga" value={form.price} onChange={(value) => update('price', value)} required />
      <SelectField label="Target" value={form.target} options={['Women', 'Men', 'Unisex', 'Kids']} onChange={(value) => update('target', value)} />
      <SelectField label="Availability" value={form.availability} options={['Tersedia', 'Pre-order', 'Habis']} onChange={(value) => update('availability', value)} />
      <Field label="Warna (pisahkan koma jika lebih dari satu)" value={form.color} onChange={(value) => { update('color', value); const colors = value.split(',').map((c) => c.trim()).filter(Boolean); update('availableColors', colors) }} required />
      <label className="color-toggle-field">Warna Tersedia{parsedColors.length > 0 ? <div className="color-toggle-list">{parsedColors.map((color) => <button type="button" key={color} className={`color-toggle-chip ${form.availableColors.map((c) => c.trim()).includes(color) ? 'active' : ''}`} onClick={() => toggleColor(color)}>{color}</button>)}</div> : <small style={{ color: '#999' }}>Ketik warna di field "Warna" terlebih dahulu</small>}</label>
      <Field label="Ukuran tersedia (pisahkan koma)" value={availableSizesText} onChange={(value) => { setAvailableSizesText(value); update('availableSizes', parseList(value)) }} required />
      <Field label="Fitur (pisahkan koma)" value={featureText} onChange={(value) => { setFeatureText(value); update('features', parseList(value)) }} required />
    </div>
    <label>Deskripsi lengkap<textarea value={form.description} onChange={(event) => update('description', event.target.value)} required rows={3} /></label>
    <label className="image-upload-field">Gambar produk<input type="file" accept="image/jpeg,image/png,image/webp,image/gif" multiple required={!product && form.images.length === 0} onChange={(event) => { handleImageChange(event.target.files); event.target.value = ''; }} /><small>Pilih satu atau beberapa gambar (maks. 5 MB per file).</small></label>
    {(previewUrls.length > 0 || form.existingImages.length > 0) && <div className="image-preview-grid">
      {form.existingImages.map((url, i) => <div className="image-preview-item" key={`existing-${url}`}><img src={url} alt={`Gambar ${i + 1}`} /><button type="button" className="image-delete-btn" onClick={() => removeExistingImage(i)} aria-label="Hapus gambar">×</button></div>)}
      {previewUrls.map((url, i) => <div className="image-preview-item" key={`new-${url}`}><img src={url} alt={`Preview ${i + 1}`} /><span className="image-preview-badge">Baru</span><button type="button" className="image-delete-btn" onClick={() => removeNewImage(i)} aria-label="Hapus gambar">×</button></div>)}
    </div>}
    {error && <p className="form-error">{error}</p>}
    <div className="modal-actions"><button type="button" className="outline-button" onClick={onClose}>Batal</button><button type="submit" className="primary-button">Simpan produk</button></div>
  </form></section></div>
}

function Field({ label, value, onChange, required }: { label: string; value: string; onChange: (value: string) => void; required?: boolean }) {
  return <label>{label}<input required={required} value={value} onChange={(event) => onChange(event.target.value)} /></label>
}
function SelectField({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (value: string) => void }) { return <label>{label}<select value={value} onChange={(event) => onChange(event.target.value)}>{options.map((option) => <option key={option}>{option}</option>)}</select></label> }
function Loading() { return <div className="empty-state"><span className="loader" /> Memuat data...</div> }
function EmptyState({ message }: { message: string }) { return <div className="empty-state"><span className="empty-icon">□</span><strong>{message}</strong><small>Data akan muncul setelah tersedia di database.</small></div> }
export default App
