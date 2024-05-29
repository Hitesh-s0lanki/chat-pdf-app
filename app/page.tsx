import { FileDropzoneUsage } from "@/components/drop-zone";
import { Button } from "@/components/ui/button";
import { SignInButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { ArrowRight, LogIn } from "lucide-react";

const Home = async () => {
  const { userId } = await auth();
  const isAuth = !!userId;

  return (
    <div className=" h-full w-full bg-gradient-to-r from-rose-100 to-teal-100 flex justify-center items-center">
      <div className="flex flex-col gap-2 items-center justify-center">
        <h1 className=" text-5xl font-semibold">Chat with any PDF</h1>
        <div className="flex gap-2">
          {isAuth && (
            <Button size="sm" className="mt-3">
              Go to Chats <ArrowRight className="size-4 ml-2" />
            </Button>
          )}
        </div>
        <p className=" max-w-xl mt-2 text-lg text-slate-600 flex justify-center items-center text-center">
          Join millions of students, researchers and professionals to instantly
          answer questions and understand research with AI
        </p>
        {!isAuth && (
          <SignInButton mode="modal">
            <Button size={"sm"}>
              Login to get started!
              <LogIn className="size-4 ml-2" />
            </Button>
          </SignInButton>
        )}
        {isAuth && <FileDropzoneUsage />}
      </div>
    </div>
  );
};

export default Home;
