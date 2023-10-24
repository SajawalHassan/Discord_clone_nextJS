"use client";

import { X, UploadCloud } from "lucide-react";

import * as LR from "@uploadcare/blocks";
import { useState } from "react";
import Image from "next/image";

LR.registerBlocks(LR);

interface PropTypes {
  value: string;
  onChange: (url?: string) => void;
}

export const UploadFile = ({ onChange, value }: PropTypes) => {
  const [uploadIsFinished, setUploadIsFinished] = useState<boolean>(false);

  window.addEventListener("LR_UPLOAD_FINISH", (e) => {
    onChange(e.detail?.data[0].cdnUrl);
  });

  window.addEventListener("LR_INIT_FLOW", (e) => {
    setUploadIsFinished(false);
  });

  window.addEventListener("LR_DONE_FLOW", (e) => {
    setUploadIsFinished(true);
  });

  if (value && uploadIsFinished == true) {
    return (
      <div className="relative h-20 w-20">
        <Image
          src={value}
          alt="Upload"
          className="rounded-full bg-gray-500"
          fill
        />
        <button
          type="button"
          className="absolute top-0 right-0 bg-rose-500 rounded-full p-1 hover:bg-rose-400 shadow-sm"
          onClick={() => onChange("")}
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="text-black">
      <lr-config
        ctx-name="my-uploader"
        pubkey={process.env.NEXT_PUBLIC_UPLOADCARE_PUBLIC_KEY}
        maxLocalFileSizeBytes={10000000}
        multiple={false}
        imgOnly={true}
        sourceList="local"
      ></lr-config>

      <div className="flex flex-col items-center justify-center gap-y-4 py-10 px-20 rounded-lg border border-dotted border-gray-500">
        <div className="gap-y-1 flex flex-col items-center justify-center">
          <UploadCloud className="h-10 w-10" />
          <p className="text-blue-500 font-bold">
            Choose files or drag and drop
          </p>
        </div>
        <lr-file-uploader-regular
          id="uploader"
          css-src="https://cdn.jsdelivr.net/npm/@uploadcare/blocks@0.25.0/web/lr-file-uploader-regular.min.css"
          ctx-name="my-uploader"
        ></lr-file-uploader-regular>
      </div>
    </div>
  );
};
