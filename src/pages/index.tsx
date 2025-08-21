import matter from "gray-matter";
import type { GetStaticProps } from "next";
import type { MDXRemoteSerializeResult } from "next-mdx-remote";
import { serialize } from "next-mdx-remote/serialize";
import { NextSeo } from "next-seo";
import { useEffect, useRef } from "react";

import seo from "data/seo.json";
import Credits from "src/components/Credits";
import Renderer from "src/components/Renderer";

interface _Props {
  source: MDXRemoteSerializeResult;
}

export const getStaticProps: GetStaticProps = async ({}) => {
  const _content = (await import("data/content.mdx")).default as unknown as string;
  const { content, data } = matter(_content);

  const source = await serialize(content, {
    scope: data,
  });

  return {
    props: {
      source,
    } as _Props,
  };
};

export default function Home({ source }: _Props) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch((error) => {
        console.log("Autoplay prevented:", error);
      });
    }
  }, []);

  return (
    <>
      <NextSeo {...seo} />
      <div className={"wrapper"}>
        <video
          ref={videoRef}
          className="background-video"
          autoPlay
          loop
          muted
          playsInline
          poster="/background.png"
        >
          {/* Vidéo pour mobile (petit format) */}
          <source 
            src="/video-0820.mp4" 
            type="video/mp4" 
            media="(max-width: 768px)"
          />
          {/* Vidéo pour tablette (format moyen) */}
          <source 
            src="/video-0820.mp4" 
            type="video/mp4" 
            media="(min-width: 769px) and (max-width: 1024px)"
          />
          {/* Vidéo pour desktop (format original) */}
          <source 
            src="/video-0820.mp4" 
            type="video/mp4" 
            media="(min-width: 1025px)"
          />
          {/* Fallback pour tous les navigateurs */}
          <source src="/video-0820.mp4" type="video/mp4" />
        </video>
        <div className={"content"}>
          <div id={"lynk-instance"}>
            <Renderer>{source}</Renderer>
          </div>
          <Credits />
        </div>
        <style jsx global>{``}</style>
      </div>
    </>
  );
}
