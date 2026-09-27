import { Eyebrow } from "@/components/ui/Eyebrow";
import { PageHeroBanner } from "@/components/PageHeroBanner";
import type { ImageSlide } from "@/lib/site-images";

type PageHeroProps = {
  eyebrow: string;
  title: string;
  description?: string;
  /** Carrousel bannière sous la barre de navigation */
  slides?: ImageSlide[];
};

export function PageHero({ eyebrow, title, description, slides }: PageHeroProps) {
  if (slides && slides.length > 0) {
    return <PageHeroBanner eyebrow={eyebrow} title={title} description={description} slides={slides} />;
  }

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
