export default function SectionHead({ eyebrow, title }) {
  return (
    <div className="max-w-xl">
      <p className="text-[10px] uppercase tracking-brand text-muted">{eyebrow}</p>
      <h2 className="mt-5 font-display text-[2.6rem] font-light leading-none sm:text-[3.2rem]">{title}</h2>
    </div>
  );
}
