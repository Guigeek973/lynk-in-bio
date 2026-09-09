import { useEffect, useState } from "react";

const BACKGROUND_IMAGES = [
  "/img/collage coco.jpeg",
  "/img/summer of love collage.jpeg",
  "/img/The end collage.jpeg",
];

const SLIDE_DURATION_MS = 3000;

export default function BackgroundSlideshow() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveIndex((index) => (index + 1) % BACKGROUND_IMAGES.length);
    }, SLIDE_DURATION_MS);

    return () => window.clearInterval(timer);
  }, []);

  return (
    <div className="background-slideshow" aria-hidden="true">
      {BACKGROUND_IMAGES.map((src, index) => (
        <div
          key={src}
          className={`background-slide${index === activeIndex ? " background-slide--active" : ""}`}
          style={{ backgroundImage: `url("${src}")` }}
        />
      ))}
    </div>
  );
}
