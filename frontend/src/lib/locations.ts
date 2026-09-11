export type LocationOption = { id: string; name: string }

const apiUrl = import.meta.env.VITE_API_URL
async function load(path: string): Promise<LocationOption[]> {
  const response = await fetch(`${apiUrl}${path}`, { headers: { Accept: 'application/json' } })
  const payload = await response.json().catch(() => ({})) as { data?: Array<Record<string, unknown>> }
  if (!response.ok) throw new Error('Data lokasi gagal dimuat')
  return (payload.data ?? []).map((item) => ({ id: String(item.id ?? item.province_id ?? item.city_id ?? item.district_id ?? item.subdistrict_id ?? item.sub_district_id ?? ''), name: String(item.name ?? item.province_name ?? item.city_name ?? item.district_name ?? item.subdistrict_name ?? item.sub_district_name ?? '') })).filter((item) => item.id && item.name)
}

export const fetchProvinces = () => load('/locations/provinces')
export const fetchCities = (provinceId: string) => load(`/locations/cities/${encodeURIComponent(provinceId)}`)
export const fetchDistricts = (cityId: string) => load(`/locations/districts/${encodeURIComponent(cityId)}`)
export const fetchSubdistricts = (districtId: string) => load(`/locations/subdistricts/${encodeURIComponent(districtId)}`)

export function normalizeWhatsapp(value: string): string {
  let phone = value.replace(/[\s().-]+/g, '')
  if (phone.startsWith('+')) phone = phone.slice(1)
  if (phone.startsWith('0')) phone = `62${phone.slice(1)}`
  else if (phone.startsWith('8')) phone = `62${phone}`
  return phone
}
