import CreateThreadForm from '@/components/CreateThreadForm';

export default async function NewThreadPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params; // ✅ unwrap for Next 16

  return (
    <div className="max-w-2xl mx-auto">
      <h1
        style={{ color: 'var(--text)' }}
        className="text-2xl font-bold mb-6"
      >
        New Thread in /{slug}/
      </h1>

      <CreateThreadForm boardSlug={slug} />
    </div>
  );
}