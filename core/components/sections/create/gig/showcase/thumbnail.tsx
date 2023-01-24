import Button from "@core/components/elements/button";
import Field from "@core/components/elements/field";
import Symbol from "@core/components/elements/symbol";
import Modal from "@core/components/layouts/modal";
import useUpload from "@core/hooks/use-upload";
import stores from "@core/stores";
import { type Modal as ModalType } from "@core/types/modal";
import validate from "@core/utilities/validate";
import schemas from "@core/validations/schemas";
import { PhotoIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import { useState, useEffect, type FormEvent } from "react";
import { ZodIssue } from "zod";

type Props = {
  modal: ModalType;
};

const Thumbnail = ({ modal }: Props) => {
  const fields = stores.gig.thumbnail((state) => state.fields);
  const setFields = stores.gig.thumbnail((state) => state.setFields);
  const { thumbnails: setThumbnails } = stores.gig.base(
    (state) => state.setFields
  );
  const clear = stores.gig.thumbnail((state) => state.clear);
  const [warnings, setWarnings] = useState<ZodIssue[]>([]);
  const fileId = "file";

  const {
    data,
    loading,
    handleSubmit: handleUpload,
    handleChange,
  } = useUpload.image({
    name: fileId,
  });

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    event.preventDefault();
    const result = schemas.gig.thumbnail.safeParse(fields);
    if (result.success) {
      const data = (await handleUpload(event)) as string;
      setThumbnails({ ...fields, image: data });
      handleClear();
      if (!loading) modal.handleClose();
      return;
    }
    setWarnings(result.error.issues);
  };

  const handleClear = () => {
    setWarnings([]);
    clear();
  };

  useEffect(() => {
    if (data) {
      setFields.image(data);
    }
  }, [data]);

  return (
    <Modal
      title="Thumbnail"
      description="Get noticed by the right buyers with visual examples of your services."
      state={modal.state}
      handleClose={modal.handleClose}
      className="max-w-5xl">
      <div className="grid grid-cols-[1fr,2fr] gap-8">
        <form
          onSubmit={handleSubmit}
          onChange={handleChange}
          className="row-span-2 space-y-4">
          <Field.Body
            id="image"
            label="Image"
            description="Get noticed by the right buyers with visual examples of your services."
            tooltip="By uploading images you will have a higher chance of getting a client."
            warning={validate(warnings, "image")}>
            <Field.File id="upload" name={fileId} />
            <div className="relative grid aspect-video items-center overflow-hidden rounded border">
              {data ? (
                <Image src={data} alt={data} fill className="object-contain" />
              ) : (
                <div className="mx-auto flex flex-col items-center">
                  <Symbol
                    Icon={PhotoIcon}
                    size="large"
                    isHoverDisabled
                    className="animate-bounce"
                  />
                  <span className="text-sm font-semibold text-primary-dark/fade">
                    No Image Uploaded
                  </span>
                </div>
              )}
            </div>
          </Field.Body>
          <div className="absolute bottom-8 left-8 flex gap-4">
            <Button type="submit">
              {loading ? "Uploading" : "Add Thumbnail"}
            </Button>
            <Button variant="secondary" onClick={handleClear}>
              Clear
            </Button>
          </div>
        </form>
        <div>
          <Field.Body
            id="title"
            label="Title"
            description="Where do you live?"
            tooltip="Any information needed here in the form are safe and private."
            warning={validate(warnings, "image")}>
            <Field.Text
              id="title"
              isFull
              placeholder="Codery Clone Website"
              value={fields.title}
              onChange={setFields.title}
            />
          </Field.Body>
          <Field.Body
            id="description"
            label="Description"
            description="Where do you live?"
            tooltip="Any information needed here in the form are safe and private."
            warning={validate(warnings, "description")}>
            <Field.Textarea
              id="position"
              isFull
              placeholder="Lorem ipsum dolor sit amet consectetur adipisicing elit. Nostrum, non. Vitae ut perspiciatis recusandae non incidunt deleniti possimus debitis magnam eos, aspernatur, quidem, dicta rem molestiae consectetur quibusdam? Consectetur, molestias!"
              value={fields.description}
              onChange={setFields.description}
            />
          </Field.Body>
          <Field.Body
            id="repository"
            label="Repository"
            description="Where do you live?"
            tooltip="Any information needed here in the form are safe and private."
            warning={validate(warnings, "repository")}>
            <Field.Text
              id="repository"
              isFull
              placeholder="Codery Clone Website"
              value={fields.repository}
              onChange={setFields.repository}
            />
          </Field.Body>
          <Field.Body
            id="website"
            label="Website"
            description="Where do you live?"
            tooltip="Any information needed here in the form are safe and private."
            warning={validate(warnings, "website")}>
            <Field.Text
              id="website"
              isFull
              placeholder="Codery Clone Website"
              value={fields.website}
              onChange={setFields.website}
            />
          </Field.Body>
          <Button
            variant="tertiary"
            onClick={modal.handleClose}
            className="absolute right-8 bottom-8">
            Close
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default Thumbnail;
