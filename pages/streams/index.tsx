import type { NextPage } from "next";
import Link from "next/link";
import Layout from "@components/layout";
import FloatingButton from "@components/floating-button";
import { Stream } from "@prisma/client";
import { useEffect } from "react";
import useSWRInfinite from "swr/infinite";

interface StreamsResponse {
  ok: boolean;
  streams: Stream[];
}

const getKey = (pageIndex: number, previousPageData: StreamsResponse) => {
  if (previousPageData && !previousPageData?.streams?.length) return null; // reached the end
  return `/api/streams?page=${pageIndex}&limit=10`; // SWR key
};

const Live: NextPage = () => {
  const { data, size, setSize } = useSWRInfinite<StreamsResponse>(getKey);

  useEffect(() => {
    const handleScroll = () => {
      const { scrollTop, offsetHeight } = document.documentElement;
      if (window.innerHeight + scrollTop + 10 >= offsetHeight) {
        setSize(size + 1);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  });

  return (
    <Layout hasTabBar title="라이브">
      <div className=" divide-y-[1px] space-y-4">
        {data?.map(({ streams }) => {
          return streams?.map((stream) => (
            <Link key={stream.id} href={`/streams/${stream.id}`}>
              <a className="pt-4 block  px-4">
                <div className="w-full rounded-md shadow-sm bg-slate-300 aspect-video" />
                <h1 className="text-2xl mt-2 font-bold text-gray-900">
                  {stream.name}
                </h1>
              </a>
            </Link>
          ));
        })}
        <FloatingButton href="/streams/create">
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
            ></path>
          </svg>
        </FloatingButton>
      </div>
    </Layout>
  );
};

export default Live;
