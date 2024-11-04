import TextareaField from "@/components/fieldForm/TextareaField";
import TitleField from "@/components/titleField/TitleField";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import ImageSlideUploader from "@/components/uploadImage/ImageSlideUploader";
import ImageUploader from "@/components/uploadImage/ImageUploader";
import React, { useEffect, useState } from "react";

const FormCompanyDescription = ({ form }) => {
  const [coverImage, setCoverImage] = useState(null); // Changed to null
  const [slideImages, setSlideImages] = useState(null || []); // Changed to null

  useEffect(() => {
    const orgCoverImage = form.getValues("orgCoverImage");
    const orgImages = form.getValues("orgImages");
    console.log(orgCoverImage);

    if (orgCoverImage) {
      setCoverImage(orgCoverImage); // Set the image preview if available
    }
    if (orgImages) {
      setSlideImages(orgImages); // Set the image preview if available
    }
  }, [form]);

  return (
    <div className="bg-secondary p-5 rounded-xl">
      <TitleField children={"Công ty"} />
      <div className="grid grid-cols-12 py-10 px-20">
        <div className="w-full grid col-start-1 col-end-13 gap-5 mt-5">
          {/* Company Benefit Field */}
          <TextareaField
            control={form.control}
            name="orgBenefit"
            labelName="Lợi ích công ty"
            placeholder="Giới thiệu về Lợi ích công ty"
            className="flex items-center"
            classNameLabel="flex items-center justify-between min-w-44 max-w-44 pr-3 leading-5 ant-form-item-required"
            id="orgBenefit"
            htmlFor="orgBenefit"
          />

          <FormField
            control={form.control}
            name="orgCoverImage"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="flex w-full items-center">
                    <Label className="flex items-center justify-between min-w-44 max-w-44 pr-3 leading-5">
                      Hình ảnh bìa
                    </Label>
                    <ImageUploader
                      id="orgCoverImage" // Unique ID for cover image
                      value={coverImage}
                      onChange={(images) => {
                        setCoverImage(images);
                        field.onChange(images);
                      }}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="orgImages"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="">
                    <Label className="flex items-center justify-between min-w-44 max-w-44 pr-3 leading-5 my-3">
                      Hình ảnh slide
                    </Label>
                    <ImageSlideUploader
                      id="orgImages"
                      value={slideImages}
                      onChange={(images) => {
                        setSlideImages(images);
                        field.onChange(images);
                      }}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>
    </div>
  );
};

export default FormCompanyDescription;
