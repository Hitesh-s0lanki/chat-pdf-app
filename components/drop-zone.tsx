"use client";

import { FileDropzone, type FileState } from "@/components/FileDropzone";
import { useCreateChat } from "@/features/api/use-file-upload";
import { useEdgeStore } from "@/lib/edgestore";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function FileDropzoneUsage() {
  const router = useRouter();
  const { mutate, isPending } = useCreateChat();
  const [fileStates, setFileStates] = useState<FileState[]>([]);
  const { edgestore } = useEdgeStore();

  function updateFileProgress(key: string, progress: FileState["progress"]) {
    setFileStates((fileStates) => {
      const newFileStates = structuredClone(fileStates);
      const fileState = newFileStates.find(
        (fileState) => fileState.key === key
      );
      if (fileState) {
        fileState.progress = progress;
      }
      return newFileStates;
    });
  }

  return (
    <>
      <FileDropzone
        value={fileStates}
        onChange={(files) => {
          setFileStates(files);
        }}
        dropzoneOptions={{
          maxFiles: 1,
        }}
        disabled={isPending}
        onFilesAdded={async (addedFiles) => {
          setFileStates([...fileStates, ...addedFiles]);
          await Promise.all(
            addedFiles.map(async (addedFileState) => {
              try {
                const res = await edgestore.publicFiles.upload({
                  file: addedFileState.file,
                  onProgressChange: async (progress: any) => {
                    updateFileProgress(addedFileState.key, progress);
                    if (progress === 100) {
                      // wait 1 second to set it to complete
                      // so that the user can see the progress bar at 100%
                      await new Promise((resolve) => setTimeout(resolve, 1000));
                      updateFileProgress(addedFileState.key, "COMPLETE");
                    }
                  },
                });

                const formData = new FormData();
                formData.set("file_key", addedFileState.key);
                formData.set("file_name", addedFileState.file.name);
                formData.set("file_url", res.url);
                formData.set("file", addedFileState.file);

                mutate(formData);

                router.push("/chat");
              } catch (err) {
                updateFileProgress(addedFileState.key, "ERROR");
              }
            })
          );
        }}
      />
    </>
  );
}
