import { useClickOutside } from "@mantine/hooks";
import { TRPCClientError } from "@trpc/client";
import Image from "next/image";
import React, { useContext, useEffect, useState, type FC } from "react";
import { toast } from "react-toastify";
import slugify from "slugify";
import { useDebouncedCallback } from "use-debounce";
import { ImagePlaceholder, Input } from "~/component/miniComponent";
import ImagePreview from "~/svgs/ImagePreview";
import { slugSetting } from "~/utils/constants";
import { C, type ContextValue } from "~/utils/context";
import { handleImageChange } from "~/utils/miniFunctions";
import NewArticleModal from "../../popup/NewArticleModal";

export interface ArticleData {
  title: string;
  subtitle?: string;
  content: string;
  cover_image?: string;
  tags: string[];
  slug: string;
  series?: string;
  seoTitle?: string;
  seoDescription?: string;
  seoOgImage?: string;
  disabledComments: boolean;
}

const NewArticleBody: FC<{
  publishModal: boolean;
  setPublishModal: React.Dispatch<React.SetStateAction<boolean>>;
  publishing: boolean;
  setPublishing: React.Dispatch<React.SetStateAction<boolean>>;
  setSavedState: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({
  setPublishModal,
  publishModal,
  publishing,
  setPublishing,
  setSavedState,
}) => {
  const { handleChange } = useContext(C) as ContextValue;
  const [query, setQuery] = useState("");
  // const [createTagState, setCreateTagState] = useState(false);

  // useEffect(() => {
  //   if (createTagState) {
  //     document.querySelector("body")?.setAttribute("style", "overflow:hidden");
  //   }
  // }, [createTagState]);

  const [data, setData] = useState<ArticleData>({
    title: "",
    subtitle: "",
    content: "",
    cover_image: undefined,
    series: undefined,
    tags: [],
    slug: "",
    seoTitle: "",
    seoDescription: "",
    seoOgImage: "",
    disabledComments: false,
  });

  const saveData = (): void => {
    setSavedState(false);
    localStorage.setItem("savedData", JSON.stringify(data));
    setTimeout(() => {
      setSavedState(true); // for fake saving loading 😂😂
    }, 500);
  };

  const debounced = useDebouncedCallback(() => {
    void saveData();
    return;
  }, 500);

  useEffect(() => {
    void debounced();
  }, [data]);

  const [file, setFile] = React.useState<string | null>(null);
  const [fileModal, setFileModal] = React.useState<boolean>(false); // open and close file upload modal
  const ref = useClickOutside<HTMLDivElement>(() => setFileModal(false));

  useEffect(() => {
    // useEffect to fill up the cover image
    if (file) {
      setData((prev) => ({
        ...prev,
        cover_image: file,
      }));
    }
  }, [file]);

  const handleImage = async (
    event: React.ChangeEvent<HTMLInputElement>
  ): Promise<void> => {
    const file = event.target.files?.[0];

    if (!file) return;

    try {
      const fileData = await handleImageChange(file);
      setFile(fileData);
      setFileModal(false);
    } catch (error) {
      if (error instanceof TRPCClientError) {
        toast.error(error.message);
      }
    }
  };

  return (
    <main className="relative min-h-screen w-full overflow-hidden border-b border-border-light bg-white dark:border-border dark:bg-primary">
      <div className="mx-auto w-full max-w-[1000px] px-4 py-6">
        <div className="relative mb-5 flex items-center gap-2">
          <button
            onClick={() => setFileModal((prev) => !prev)}
            className="btn-subtle flex items-center justify-center gap-2"
          >
            <ImagePreview className="h-5 w-5 fill-none stroke-gray-700 dark:stroke-text-secondary" />
            <span>{"Add Cover"}</span>
          </button>

          {fileModal && (
            <div
              ref={ref}
              className="absolute left-0 top-full z-30 mt-2 w-full sm:w-96"
            >
              <ImagePlaceholder
                file={file}
                minHeight={"10rem"}
                handleChange={async (event) => await handleImage(event)}
                recommendedText="Recommended dimension is 1600 x 840"
              />
            </div>
          )}
        </div>

        {file && (
          <>
            <div className="mb-5 w-full rounded-md border border-border-light dark:border-border">
              <Image
                src={file ? file : "/images/placeholder.png"}
                alt="cover"
                width={1600}
                height={840}
                className="max-h-[30rem] w-full rounded-md object-cover"
              />
            </div>
          </>
        )}

        <section className="px-2">
          <div className="relative">
            <Input
              value={data.title}
              onChange={(e) => {
                handleChange(e, setData);
                setData((prev) => ({
                  ...prev,
                  slug: slugify(e.target.value, slugSetting),
                }));
              }}
              placeholder="Article Title"
              input_type="text"
              variant="TRANSPARENT"
              name="title"
              fontSize="3xl"
              type="INPUT"
              required={true}
              autoFocus={true}
            />
          </div>
          <Input
            value={data.subtitle as string}
            onChange={(e) => {
              handleChange(e, setData);
            }}
            placeholder="Article Subtitle (optional)"
            input_type="text"
            variant="TRANSPARENT"
            name="subtitle"
            fontSize="2xl"
            type="INPUT"
            required={true}
          />

          <div className="relative">
            <Input
              value={data.content}
              onChange={(e) => {
                handleChange(e, setData);
              }}
              placeholder="Start writing your story..."
              input_type="text"
              variant="TRANSPARENT"
              fontSize="lg"
              name="content"
              type="TEXTAREA"
              required={true}
            />
          </div>
        </section>
      </div>

      {publishModal && (
        <div
          className="fixed inset-0 bg-transparent backdrop-blur-[2px]"
          onClick={() => setPublishModal((prev) => !prev)}
        ></div>
      )}

      <NewArticleModal
        publishModal={publishModal}
        setPublishModal={setPublishModal}
        data={data}
        setData={setData}
        publishing={publishing}
        setPublishing={setPublishing}
        query={query}
        setQuery={setQuery}
        // createTagState={createTagState}
        // setCreateTagState={setCreateTagState}
      />

      {/* {createTagState && (
        <NewTagModal
          query={query}
          setQuery={setQuery}
          setCreateTagState={setCreateTagState}
        />
      )} */}
    </main>
  );
};

export default NewArticleBody;