"use client";

import { ServiceForm } from "./service-form";

export function EditServiceLoader({ serviceId }: { serviceId: string }) {
  return <ServiceForm serviceId={serviceId} />;
}
