import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

type Props = {
  user: { name: string; email: string };
};

export function Header({ user }: Props) {
  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <header className="h-14 bg-white border-b border-zinc-200 flex items-center justify-between px-8 sticky top-0 z-10">
      <div />
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-400 hover:text-zinc-900">
          <Bell size={15} />
        </Button>
        <div className="flex items-center gap-2.5">
          <Avatar className="h-7 w-7">
            <AvatarFallback className="bg-zinc-950 text-white text-xs font-medium">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="hidden sm:block">
            <p className="text-xs font-medium text-zinc-900 leading-none">{user.name}</p>
            <p className="text-xs text-zinc-400 mt-0.5">{user.email}</p>
          </div>
        </div>
      </div>
    </header>
  );
}