import ChatComponent from "@/components/chat";
import PDFViewer from "@/components/pdf-viewer";
import Sidebar from "@/components/sidebar";
import { db } from "@/lib/db";
import { chats } from "@/lib/schema";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";

interface IParams {
  params: {
    chatId: string;
  };
}

const ChatIdPage = async ({ params }: IParams) => {
  const { userId } = await auth();

  if (!userId) {
    return redirect("/");
  }

  const _chats = await db.select().from(chats).where(eq(chats.userId, userId));

  if (!_chats || !_chats.find((chat) => chat.id === parseInt(params.chatId))) {
    return redirect("/");
  }

  const currentChat = _chats.find(
    (chat) => chat.id === parseInt(params.chatId)
  );

  return (
    <div className=" flex h-full w-full">
      <div className=" flex-[1] max-w-xs">
        <Sidebar chats={_chats} chatId={parseInt(params.chatId)} />
      </div>
      <div className=" flex-[5] min-h-full overflow-auto">
        <PDFViewer pdf_url={currentChat?.pdfUrl || ""} />
      </div>
      <div className=" flex-[3] border-l-4 border-l-slate-200">
        <ChatComponent chatId={parseInt(params.chatId)} />
      </div>
    </div>
  );
};

export default ChatIdPage;
