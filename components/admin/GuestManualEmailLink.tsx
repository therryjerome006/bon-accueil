import Link from "next/link";
import { Mail } from "lucide-react";
import {
  buildGuestRoomEmailDraft,
  buildGuestTableEmailDraft,
  gmailComposeLink,
  mailtoLink,
} from "@/lib/admin/guest-email";
import { getContactEmail } from "@/lib/env";

type GuestManualEmailLinkProps = {
  type: "room" | "table";
  status: string;
  email: string;
  firstName: string;
  lastName: string;
  hasAccount: boolean;
  room?: {
    title: string;
    checkIn: string;
    checkOut: string;
    transactionCode?: string | null;
    totalPrice?: number | null;
  };
  table?: {
    name: string;
    reservationDate: string;
    reservationTime: string;
    partySize: number;
  };
};

export function GuestManualEmailLink(props: GuestManualEmailLinkProps) {
  if (props.hasAccount) return null;
  if (!["confirmed", "rejected", "cancelled"].includes(props.status)) return null;

  const status = props.status as "confirmed" | "rejected" | "cancelled";
  const hotelEmail = getContactEmail();

  const draft =
    props.type === "room" && props.room
      ? buildGuestRoomEmailDraft({
          email: props.email,
          firstName: props.firstName,
          lastName: props.lastName,
          roomTitle: props.room.title,
          checkIn: props.room.checkIn,
          checkOut: props.room.checkOut,
          transactionCode: props.room.transactionCode,
          totalPrice: props.room.totalPrice,
          status,
        })
      : props.type === "table" && props.table
        ? buildGuestTableEmailDraft({
            email: props.email,
            firstName: props.firstName,
            lastName: props.lastName,
            tableName: props.table.name,
            reservationDate: props.table.reservationDate,
            reservationTime: props.table.reservationTime,
            partySize: props.table.partySize,
            status,
          })
        : null;

  if (!draft) return null;

  const label =
    status === "confirmed"
      ? "Confirmation"
      : status === "rejected"
        ? "Refus"
        : "Annulation";

  return (
    <div className="mt-2 space-y-1">
      <p className="text-[10px] text-ink/55 leading-snug">
        Invité — envoyer depuis <strong>{hotelEmail}</strong> (votre messagerie, pas le site).
      </p>
      <div className="flex flex-col gap-1">
        <Link
          href={gmailComposeLink(draft)}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-xs text-palm-deep hover:opacity-70"
        >
          <Mail size={12} />
          {label} via Gmail
        </Link>
        <Link
          href={mailtoLink(draft)}
          className="inline-flex items-center gap-1.5 text-xs text-ink/60 hover:opacity-70"
        >
          <Mail size={12} />
          {label} via Outlook / autre app
        </Link>
      </div>
    </div>
  );
}

export function ReservationAudienceBadge({ hasAccount }: { hasAccount: boolean }) {
  return (
    <span
      className={`inline-block text-[10px] uppercase tracking-wide px-1.5 py-0.5 rounded-sm border ${
        hasAccount
          ? "bg-palm-soft/20 text-palm-deep border-palm-soft/50"
          : "bg-amber-50 text-amber-900 border-amber-200"
      }`}
    >
      {hasAccount ? "Compte" : "Invité"}
    </span>
  );
}
