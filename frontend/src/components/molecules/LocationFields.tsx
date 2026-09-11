import { LoaderCircle } from "lucide-react";
import { useMemo, useState } from "react";

import { fetchCities, fetchDistricts, fetchProvinces, fetchSubdistricts, type LocationOption } from "@/lib/locations";

type LocationIds = { provinceId: string; cityId: string; districtId: string; subdistrictId: string };
type Props = {
  province: string; city: string; district: string; subdistrict: string;
  provinceId?: string; cityId?: string; districtId?: string; subdistrictId?: string;
  onChange: (key: "province" | "city" | "district" | "subdistrict", value: string) => void;
  onIdsChange?: (ids: LocationIds) => void;
};
const input = "mt-2 h-11 w-full rounded-xl border border-input bg-background px-3 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/30 disabled:opacity-50";
const locationKey = (value: string) => value.toUpperCase().replace(/^(KOTA|KABUPATEN)\s+/, "").replace(/\s*\([^)]*\)\s*/g, "").trim();
const findOption = (options: LocationOption[], value: string) => options.find((option) => locationKey(option.name) === locationKey(value));

export function LocationFields({ province, city, district, subdistrict, provinceId = "", cityId = "", districtId = "", subdistrictId = "", onChange, onIdsChange }: Props) {
  const [provinces, setProvinces] = useState<LocationOption[]>([]);
  const [cities, setCities] = useState<LocationOption[]>([]);
  const [districts, setDistricts] = useState<LocationOption[]>([]);
  const [subdistricts, setSubdistricts] = useState<LocationOption[]>([]);
  const [loading, setLoading] = useState<"province" | "city" | "district" | "subdistrict" | null>(null);
  const provinceOption = useMemo(() => findOption(provinces, province), [province, provinces]);
  const cityOption = useMemo(() => findOption(cities, city), [city, cities]);
  const districtOption = useMemo(() => findOption(districts, district), [district, districts]);
  const ids = (next: Partial<LocationIds>): LocationIds => ({ provinceId, cityId, districtId, subdistrictId, ...next });


  const load = async (key: "province" | "city" | "district" | "subdistrict") => {
    if (loading === key) return;
    if (key === "city" && !(provinceOption?.id || provinceId)) return;
    if (key === "district" && !(cityOption?.id || cityId)) return;
    if (key === "subdistrict" && !(districtOption?.id || districtId)) return;
    if ((key === "province" && provinces.length) || (key === "city" && cities.length) || (key === "district" && districts.length) || (key === "subdistrict" && subdistricts.length)) return;
    setLoading(key);
    try {
      if (key === "province") setProvinces(await fetchProvinces());
      if (key === "city") setCities(await fetchCities(provinceOption?.id || provinceId));
      if (key === "district") setDistricts(await fetchDistricts(cityOption?.id || cityId));
      if (key === "subdistrict") setSubdistricts(await fetchSubdistricts(districtOption?.id || districtId));
    } catch {
      if (key === "province") setProvinces([]);
      if (key === "city") setCities([]);
      if (key === "district") setDistricts([]);
      if (key === "subdistrict") setSubdistricts([]);
    } finally { setLoading(null); }
  };

  const select = (label: string, value: string, options: LocationOption[], key: "province" | "city" | "district" | "subdistrict", disabled: boolean) => {
    const isLoading = loading === key;
    return (
      <label className="relative text-sm font-medium">
        {label}
        <span className="relative block">
          <select
            required value={findOption(options, value)?.name ?? value} disabled={disabled || isLoading}
            onFocus={() => void load(key)} onMouseDown={() => void load(key)}
            onChange={(event) => {
              const option = findOption(options, event.target.value);
              onChange(key, event.target.value);
              if (key === "province") { setCities([]); setDistricts([]); setSubdistricts([]); }
              if (key === "city") { setDistricts([]); setSubdistricts([]); }
              if (key === "district") setSubdistricts([]);
              if (key === "province") onIdsChange?.(ids({ provinceId: option?.id ?? event.target.value, cityId: "", districtId: "", subdistrictId: "" }));
              if (key === "city") onIdsChange?.(ids({ cityId: option?.id ?? event.target.value, districtId: "", subdistrictId: "" }));
              if (key === "district") onIdsChange?.(ids({ districtId: option?.id ?? event.target.value, subdistrictId: "" }));
              if (key === "subdistrict") onIdsChange?.(ids({ subdistrictId: option?.id ?? event.target.value }));
            }}
            className={input}
          >
            <option value="">Pilih {label.toLowerCase()}</option>
            {value && !options.some((option) => option.name === value) && <option value={value}>{value}</option>}
            {options.map((option) => <option key={option.id} value={option.name}>{option.name}</option>)}
          </select>
          {isLoading && <LoaderCircle aria-label={`Memuat ${label.toLowerCase()}`} className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 animate-spin text-muted-foreground" />}
        </span>
      </label>
    );
  };

  return <>
    {select("Provinsi", province, provinces, "province", false)}
    {select("Kota/Kabupaten", city, cities, "city", !(provinceOption?.id || provinceId))}
    {select("Kecamatan", district, districts, "district", !(cityOption?.id || cityId))}
    {select("Desa/Kelurahan", subdistrict, subdistricts, "subdistrict", !(districtOption?.id || districtId))}
  </>;
}
