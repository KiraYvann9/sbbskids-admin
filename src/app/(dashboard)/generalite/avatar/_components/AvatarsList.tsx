"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchData } from "@/services/service";
import { Spinner } from "@/components/Spinner";

// Define a minimal shape; adjust if backend differs
export type AvatarItem = {
  id?: string | number;
  url?: string;
  image_url?: string;
  path?: string;
  avatar_url?: string;
  avatar?: string;
  description?: string | null;
};

type AvatarsResponse = AvatarItem[] | { data: AvatarItem[] } | { avatars: AvatarItem[] } | { avatars: { avatar_url?: string; id?: number | string }[] };

function resolveItems(payload: AvatarsResponse): AvatarItem[] {
  if (Array.isArray(payload)) return payload;
  if (payload && typeof payload === "object") {
    if (Array.isArray((payload as any).data)) return (payload as any).data;
    if (Array.isArray((payload as any).avatars)) return (payload as any).avatars;
  }

  return [];
}

function resolveImageUrl(item: AvatarItem): string | null {
  return (
    item.avatar_url ||
    item.url ||
    item.image_url ||
    item.path ||
    item.avatar ||
    null
  );
}

export const AvatarsList = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["avatars"],
    queryFn: async () => fetchData("admin/avatars"),
  });

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 text-muted-foreground">
        <Spinner />
        <span>Chargement des avatars...</span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-red-600">
        Une erreur s'est produite lors du chargement des avatars.
      </div>
    );
  }

  const items = resolveItems(data as AvatarsResponse);

  if (!items || items.length === 0) {
    return <div className="text-muted-foreground">Aucun avatar trouvé.</div>;
  }

  // Sort items by ID in descending order without mutating the original array
  const sortedItems = [...items].sort((a, b) => {
    const toNum = (v: unknown) => {
      if (typeof v === "number") return v;
      if (typeof v === "string") {
        const n = Number(v);
        return isNaN(n) ? -Infinity : n;
      }
      return -Infinity; // items without valid id will sink to the end
    };
    return toNum(b.id) - toNum(a.id);
  });

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
      {sortedItems.map((item, idx) => {
        const src = resolveImageUrl(item);
        const key = (item.id ?? idx).toString();
        return (
          <div key={key} className="bg-white rounded-sm shadow-sm p-2 flex flex-col items-center">
            {src ? (
              <div className="relative w-24 h-24">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={src}
                  alt={item.description ?? `Avatar ${key}`}
                  className="w-24 h-24 object-cover rounded-full border"
                />
              </div>
            ) : (
              <div className="w-24 h-24 rounded-full bg-gray-200" />
            )}
            <p className="mt-2 text-xs text-center text-muted-foreground font-semibold">{item.id ?? key}</p>
            {item.description ? (
              <p className="mt-1 text-xs text-center text-muted-foreground line-clamp-2">{item.description}</p>
            ) : null}
          </div>
        );
      }) }
    </div>
  );
};
