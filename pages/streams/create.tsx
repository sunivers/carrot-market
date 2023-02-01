import type { NextPage } from "next";
import Button from "@components/button";
import Input from "@components/input";
import Layout from "@components/layout";
import TextArea from "@components/textarea";
import useMutation from "@libs/client/useMutation";
import { Stream } from "@prisma/client";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { useRouter } from "next/router";

interface CreateStreamForm {
  name: string;
  price: number;
  description: string;
}

interface CreateStreamMutation {
  ok: boolean;
  stream: Stream;
}

const Create: NextPage = () => {
  const { register, handleSubmit } = useForm<CreateStreamForm>();
  const [createStream, { loading, data }] =
    useMutation<CreateStreamMutation>(`/api/streams`);

  const onValid = (form: CreateStreamForm) => {
    if (loading) return;
    createStream(form);
  };

  const router = useRouter();
  useEffect(() => {
    if (data && data.ok) {
      router.push(`/streams/${data.stream.id}`);
    }
  }, [data, router]);

  return (
    <Layout canGoBack title="Go Live">
      <form onSubmit={handleSubmit(onValid)} className="space-y-4 py-10 px-4">
        <Input
          register={register("name", { required: true })}
          required
          label="Name"
          name="name"
          type="text"
        />
        <Input
          register={register("price", { required: true, valueAsNumber: true })}
          required
          label="Price"
          placeholder="0.00"
          name="price"
          type="text"
          kind="price"
        />
        <TextArea
          register={register("description")}
          name="description"
          label="Description"
        />
        <Button text={loading ? "Loading..." : "Go live"} />
      </form>
    </Layout>
  );
};

export default Create;
