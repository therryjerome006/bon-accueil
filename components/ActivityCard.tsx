import Image from "next/image";
import { Calendar, DollarSign } from "lucide-react";
import type { Activity } from "@/lib/activities";
import { getActivityImage, formatActivityDate } from "@/lib/activities";

type ActivityCardProps = {
  activity: Activity;
};

export function ActivityCard({ activity }: ActivityCardProps) {
  return (
    <article className="rounded-sm overflow-hidden bg-white transition-transform hover:-translate-y-1.5 hover:shadow-xl">
      <div className="relative w-full h-56">
        <Image src={getActivityImage(activity)} alt={activity.title} fill className="object-cover" />
      </div>
      <div className="p-7">
        <h3 className="font-display text-xl mb-3 text-palm-deep">{activity.title}</h3>
        <div className="flex flex-wrap gap-4 text-xs uppercase tracking-wide text-palm mb-4">
          <span className="flex items-center gap-1.5">
            <Calendar size={13} /> {formatActivityDate(activity.date)}
          </span>
          <span className="flex items-center gap-1.5">
            <DollarSign size={13} /> {activity.price} $
          </span>
        </div>
        <p className="text-sm leading-relaxed text-ink/70">{activity.description}</p>
      </div>
    </article>
  );
}
