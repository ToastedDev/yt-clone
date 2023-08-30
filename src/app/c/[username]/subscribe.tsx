"use client";

import { Button } from "@/components/ui/button";
import { Session } from "next-auth";
import { experimental_useFormStatus as useFormStatus } from 'react-dom';

export default function SubscribeButton({
  subscribed,
}: {
  subscribed: boolean | undefined;
}) {
  const { pending } = useFormStatus()

  return subscribed ? (
        <Button type="submit" variant="secondary" disabled={pending}>
          Unsubscribe
        </Button>
      ) : (
        <Button type="submit" disabled={pending}>
          Subscribe
        </Button>
      )
      }