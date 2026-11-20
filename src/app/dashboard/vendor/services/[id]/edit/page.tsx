import { EditServiceLoader } from "@/components/dashboard/edit-service-loader";

export default async function EditServicePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <EditServiceLoader serviceId={id} />;
}
