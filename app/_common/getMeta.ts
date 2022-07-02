import type { MetaFunction } from "@remix-run/server-runtime";

const getMeta =
  ({
    title: pageTitle,
    description = "You don't have to sell your soul to get funded",
    img = "/images/Logo.png",
  }: {
    title: string;
    description?: string;
    img?: string;
  }): MetaFunction =>
  () => {
    const title = `${pageTitle} | Constancy`;
    return {
      title,
      description,
      "og:title": title,
      "og:description": description,
      "twitter:title": title,
      "twitter:description": description,
      "og:image": img,
      "twitter:image": img,
    };
  };

export default getMeta;
