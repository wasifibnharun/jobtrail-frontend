interface PlaceholderPageProps {
  title: string;
}

export default function PlaceholderPage({
  title,
}: PlaceholderPageProps) {
  return (
    <section>
      <h1 className="text-2xl font-semibold text-[#17211d]">
        {title}
      </h1>
    </section>
  );
}