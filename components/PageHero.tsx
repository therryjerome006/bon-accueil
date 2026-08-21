import { Eyebrow } from "@/components/ui/Eyebrow";

type PageHeroProps = {
  eyebrow: string;
  title: string;
  description?: string;
};

export function PageHero({ eyebrow, title, description }: PageHeroProps) {
  return (
    <section className="bg-palm-deep text-linen py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <Eyebrow inverted>{eyebrow}</Eyebrow>
        <h1 className="font-display text-4xl md:text-5xl mb-5">{title}</h1>
        {description && <p className="text-palm-soft max-w-2xl leading-relaxed">{description}</p>}
      </div>
    </section>
  );
}
