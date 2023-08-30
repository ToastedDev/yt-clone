import Link from "next/link";
import { Icons } from "./icons";

export default function Navbar() {
  return (
    <nav className="flex items-center justify-between border-b p-3">
      <div>
        <Link href="/">
          <Icons.YouTube width={120} height={30} />
        </Link>
      </div>
    </nav>
  );
}
