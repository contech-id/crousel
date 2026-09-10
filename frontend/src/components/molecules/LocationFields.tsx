import { useEffect, useMemo, useState } from "react";
import { fetchCities, fetchDistricts, fetchProvinces, fetchSubdistricts, type LocationOption } from "@/lib/locations";

type Props = {
  province: string;
  city: string;
  district: string;
  subdistrict: string;
  onChange: (key: "province" | "city" | "district" | "subdistrict", value: string) => void;
  className?: string;
};
const input =
  "mt-2 h-11 w-full rounded-xl border border-input bg-background px-3 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/30 disabled:opacity-50";
export function LocationFields({ province, city, district, subdistrict, onChange }: Props) {
  const [provinces, setProvinces] = useState<LocationOption[]>([]);
  const [cities, setCities] = useState<LocationOption[]>([]);
  const [districts, setDistricts] = useState<LocationOption[]>([]);
  const [subdistricts, setSubdistricts] = useState<LocationOption[]>([]);
  const locationKey = (value: string) => value.toUpperCase().replace(/^(KOTA|KABUPATEN)\s+/, "").replace(/\s*\([^)]*\)\s*/g, "").trim();
  const findOption = (options: LocationOption[], value: string) => options.find((option) => locationKey(option.name) === locationKey(value));
  const provinceOption = useMemo(() => findOption(provinces, province), [province, provinces]);
  const cityOption = useMemo(() => findOption(cities, city), [city, cities]);
  const districtOption = useMemo(() => findOption(districts, district), [district, districts]);
  useEffect(() => {
    void fetchProvinces()
      .then(setProvinces)
      .catch(() => undefined);
  }, []);
  useEffect(() => {
    setCities([]);
    setDistricts([]);
    setSubdistricts([]);
    if (provinceOption)
      void fetchCities(provinceOption.id)
        .then(setCities)
        .catch(() => setCities([]));
  }, [provinceOption]);
  useEffect(() => {
    setDistricts([]);
    setSubdistricts([]);
    if (cityOption)
      void fetchDistricts(cityOption.id)
        .then(setDistricts)
        .catch(() => setDistricts([]));
  }, [cityOption]);
  useEffect(() => {
    setSubdistricts([]);
    if (districtOption)
      void fetchSubdistricts(districtOption.id)
        .then(setSubdistricts)
        .catch(() => setSubdistricts([]));
  }, [districtOption]);
  const select = (
    label: string,
    value: string,
    options: LocationOption[],
    key: "province" | "city" | "district" | "subdistrict",
    disabled = false,
  ) => (
    <label className="text-sm font-medium">
      {label}
      <select
        required
        value={findOption(options, value)?.name ?? value}
        disabled={disabled}
        onChange={(event) => onChange(key, event.target.value)}
        className={input}
      >
        <option value="">Pilih {label.toLowerCase()}</option>
        {options.map((option) => (
          <option key={option.id} value={option.name}>
            {option.name}
          </option>
        ))}
      </select>
    </label>
  );
  return (
    <>
      {select("Provinsi", province, provinces, "province")}
      {select("Kota/Kabupaten", city, cities, "city", !provinceOption)}
      {select("Kecamatan", district, districts, "district", !cityOption)}
      {select("Desa/Kelurahan", subdistrict, subdistricts, "subdistrict", !districtOption)}
    </>
  );
}
