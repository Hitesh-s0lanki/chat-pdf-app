import { DrizzleChat } from "@/lib/schema";
import Link from "next/link";
import { Button } from "./ui/button";
import { MessageCircle, PlusCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  chats: DrizzleChat[];
  chatId: number;
}

const Sidebar = ({ chats, chatId }: Props) => {
  return (
    <div className=" h-full w-full p-4 text-gray-200 bg-gray-900">
      <Button className=" w-full border-dashed border-white border " asChild>
        <Link href="/">
          <PlusCircle className="mr-2 size-4" />
          New Chat
        </Link>
      </Button>

      <div className="flex max-h-full pb-20 flex-col gap-2 mt-4 overflow-auto">
        {chats.map((chat) => (
          <Link key={chat.id} href={`/chat/${chat.id}`}>
            <div
              className={cn("rounded-lg p-3 text-slate-300 flex items-center", {
                "bg-blue-600 text-white": chat.id === chatId,
                "hover:text-white": chat.id !== chatId,
              })}
            >
              <MessageCircle className="mr-2" />
              <p className="w-full overflow-hidden text-sm truncate whitespace-nowrap text-ellipsis">
                {chat.pdfName}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
