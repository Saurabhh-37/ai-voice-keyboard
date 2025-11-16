export default function TranscriptPage({
  params,
}: {
  params: { id: string };
}) {
  return (
    <div className="p-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-light text-[#111827] mb-8">
          Transcript {params.id}
        </h1>
        {/* Individual transcript view will be implemented here */}
      </div>
    </div>
  );
}

