import type { Metadata } from "next";
import { ServiceDetails } from "@/components/services/service-details";

const API_URL = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
).replace(/\/$/, "");

type Params = Promise<{ id: string }>;

interface PublicService {
  serviceName?: string;
  description?: string;
  category?: string;
  images?: string[];
  vendor?: { name?: string } | null;
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { id } = await params;
  try {
    const response = await fetch(`${API_URL}/api/services/${id}`, {
      cache: "no-store",
      headers: { Accept: "application/json" },
    });
    if (!response.ok) throw new Error("Service not found");
    const data = (await response.json()) as { service?: PublicService };
    const service = data.service;
    if (!service?.serviceName) throw new Error("Service not found");

    const title = `${service.serviceName} — Yesly`;
    const description =
      service.description?.slice(0, 160) ||
      `Book ${service.serviceName}${
        service.vendor?.name ? ` by ${service.vendor.name}` : ""
      } through Yesly.`;
    const image = service.images?.[0];

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        type: "article",
        images: image ? [{ url: image }] : undefined,
      },
      twitter: {
        card: image ? "summary_large_image" : "summary",
        title,
        description,
        images: image ? [image] : undefined,
      },
    };
  } catch {
    return { title: "Wedding Service — Yesly" };
  }
}

export default function ServiceDetailsPage() {
  return <ServiceDetails />;
}
