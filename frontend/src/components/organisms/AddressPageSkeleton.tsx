import { LoaderCircle } from "lucide-react";

type Props = { variant: "profile" | "checkout" };

export function AddressPageSkeleton({ variant }: Props) {
  return (
    <section className="flex min-h-[32rem] items-center justify-center px-4 py-20" aria-busy="true" aria-label={`Memuat alamat ${variant}`}>
      <div className="flex flex-col items-center gap-4 text-center text-muted-foreground">
        <LoaderCircle aria-hidden="true" className="size-10 animate-spin text-foreground" />
        <p className="text-sm font-medium">Memuat data alamat...</p>
      </div>
    </section>
  );
}
