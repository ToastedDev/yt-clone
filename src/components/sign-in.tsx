"use client";

import { signIn } from "next-auth/react";
import { Button, ButtonProps } from "./ui/button";

export default function SignInButton(props: ButtonProps) {
  return <Button {...props} onClick={() => signIn("google")}></Button>;
}
