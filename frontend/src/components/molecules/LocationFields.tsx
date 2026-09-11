import { useEffect, useMemo, useState } from "react";
import { fetchCities, fetchDistricts, fetchProvinces, fetchSubdistricts, type LocationOption } from "@/lib/locations";

type Props = {
  province: string;
  city: string;
  district: string;
  subdistrict: string;
  onChange: (key: "province" | "city" | "district" | "subdistrict", value: string) => void;
  className?: string;
  onLoadingChange?: (loading: boolean) => void;
  onDistrictIdChange?: (districtId: string) => void;
};
const input =
  "mt-2 h-11 w-full rounded-xl border border-input bg-background px-3 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/30 disabled:opacity-50";
const locationKey = (value: string) => value.toUpperCase().replace(/^(KOTA|KABUPATEN)\s+/, "").replace(/\s*\([^)]*\)\s*/g, "").trim();
const findOption = (options: LocationOption[], value: string) => options.find((option) => locationKey(option.name) === locationKey(value));

export function LocationFields({ province, city, district, subdistrict, onChange, onLoadingChange, onDistrictIdChange }: Props) {
  const [provinces, setProvinces] = useState<LocationOption[]>([]);
  const [cities, setCities] = useState<LocationOption[]>([]);
  const [districts, setDistricts] = useState<LocationOption[]>([]);
  const [subdistricts, setSubdistricts] = useState<LocationOption[]>([]);
  const [provincesLoaded, setProvincesLoaded] = useState(false);
  const [citiesLoadedFor, setCitiesLoadedFor] = useState<string | null>(null);
  const [districtsLoadedFor, setDistrictsLoadedFor] = useState<string | null>(null);
  const [subdistrictsLoadedFor, setSubdistrictsLoadedFor] = useState<string | null>(null);
  const provinceOption = useMemo(() => findOption(provinces, province), [province, provinces]);
  const cityOption = useMemo(() => findOption(cities, city), [city, cities]);
  const districtOption = useMemo(() => findOption(districts, district), [district, districts]);
  const loading =
    !provincesLoaded ||
    Boolean(provinceOption && citiesLoadedFor !== provinceOption.id) ||
    Boolean(cityOption && districtsLoadedFor !== cityOption.id) ||
    Boolean(districtOption && subdistrictsLoadedFor !== districtOption.id);

  useEffect(() => {
    onLoadingChange?.(loading);
  }, [loading, onLoadingChange]);

  useEffect(() => {
    onDistrictIdChange?.(districtOption?.id ?? "");
  }, [districtOption, onDistrictIdChange]);

  useEffect(() => {
    void fetchProvinces()
      .then(setProvinces)
      .catch(() => undefined)
      .finally(() => setProvincesLoaded(true));
  }, []);
  useEffect(() => {
    setCities([]);
    setCitiesLoadedFor(null);
    setDistricts([]);
    setDistrictsLoadedFor(null);
    setSubdistricts([]);
    setSubdistrictsLoadedFor(null);
    if (provinceOption) {
      const id = provinceOption.id;
      void fetchCities(id)
        .then(setCities)
        .catch(() => setCities([]))
        .finally(() => setCitiesLoadedFor(id));
    }
  }, [provinceOption]);
  useEffect(() => {
    setDistricts([]);
    setDistrictsLoadedFor(null);
    setSubdistricts([]);
    setSubdistrictsLoadedFor(null);
    if (cityOption) {
      const id = cityOption.id;
      void fetchDistricts(id)
        .then(setDistricts)
        .catch(() => setDistricts([]))
        .finally(() => setDistrictsLoadedFor(id));
    }
  }, [cityOption]);
  useEffect(() => {
    setSubdistricts([]);
    setSubdistrictsLoadedFor(null);
    if (districtOption) {
      const id = districtOption.id;
      void fetchSubdistricts(id)
        .then(setSubdistricts)
        .catch(() => setSubdistricts([]))
        .finally(() => setSubdistrictsLoadedFor(id));
    }
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
