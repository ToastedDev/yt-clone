import { getAuthSession } from "@/lib/auth";
import Image from "next/image";
import Link from "next/link";
import { Icons } from "./icons";
import SignInButton from "./sign-in";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

export default async function Navbar() {
  const session = await getAuthSession();

  return (
    <nav className="flex items-center justify-between border-b p-3">
      <div>
        <Link href="/">
          <Icons.YouTube width={130} height={36} />
        </Link>
      </div>
      <div>
        {session ? (
          <div className="h-9">
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Image
                  src={session.user.image!}
                  alt={session.user.name!}
                  width={36}
                  height={36}
                  className="rounded-full"
                />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="mr-3">
                <div className="px-2 py-1.5">
                  <h1 className="w-[110px] truncate font-semibold">
                    {session.user.name}
                  </h1>
                  <p className="w-[110px] truncate text-xs font-normal">
                    @{session.user.username}
                  </p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="hover:cursor-pointer" asChild>
                  <Link href={`/c/${session.user.username}`}>
                    <Icons.Person className="mr-1.5 h-4 w-4" />
                    Your channel
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ) : (
          <SignInButton className="h-9">
            <Icons.Person className="mr-2 h-4 w-4" />
            Sign in
          </SignInButton>
        )}
      </div>
    </nav>
  );
}
