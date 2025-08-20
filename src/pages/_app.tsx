import { AppProps } from "next/app";

import "data/styles.scss";
import theme from "data/theme";
import "src/styles/main.scss";
import "src/styles/globals.css";

export default function App({ Component, pageProps }: AppProps) {
  typeof document !== "undefined" && document.addEventListener("touchstart", () => {});

  return (
    <>
      <Component {...pageProps} />
      <style jsx global>{`
        body,
        button,
        p {
          font-family: ${theme.fonts.body}, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        h1,
        h2,
        h3,
        h4,
        h5,
        h6 {
          font-family: ${theme.fonts.heading}, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        /* Fallback styles for static export */
        * {
          box-sizing: border-box;
        }

        html, body {
          margin: 0;
          padding: 0;
          height: 100%;
        }

        #__next {
          height: 100%;
        }
      `}</style>
    </>
  );
}
