import CreateBoardForm from '@/components/CreateBoardForm';

export default function NewBoardPage() {
  return (
    <div className="max-w-lg mx-auto">
      <h1 style={{ color: 'var(--text)' }} className="text-2xl font-bold mb-2">
        Create a Board
      </h1>
      <p style={{ color: 'var(--muted)' }} className="text-sm mb-8">
        Boards start in trial mode. Reach 5 threads or 20 posts within 7 days
        to become permanent. One board per IP per day.
      </p>
      <CreateBoardForm />
    </div>
  );
}