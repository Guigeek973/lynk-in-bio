import matter from "gray-matter";
import type { GetStaticProps } from "next";
import type { MDXRemoteSerializeResult } from "next-mdx-remote";
import { serialize } from "next-mdx-remote/serialize";
import { NextSeo } from "next-seo";

import seo from "data/seo.json";
import BackgroundSlideshow from "src/components/BackgroundSlideshow";
import BeehiivNewsletter from "src/components/BeehiivNewsletter";
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
    // Trusted repo content uses JSX expressions (e.g. color={"white"}).
    blockJS: false,
  });

  return {
    props: {
      source,
    } as _Props,
  };
};

export default function Home({ source }: _Props) {
  return (
    <>
      <NextSeo {...seo} />
      <BeehiivNewsletter />
      <div className={"wrapper"}>
        <BackgroundSlideshow />
        <div className={"content"}>
          <div id={"lynk-instance"}>
            <Renderer>{source}</Renderer>
          </div>
          <Credits />
        </div>
      </div>
    </>
  );
}
