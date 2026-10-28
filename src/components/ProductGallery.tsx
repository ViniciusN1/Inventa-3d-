"use client";

import { useState } from "react";

export default function ProductGallery({
  images,
}: {
  images: string[];
}) {
  const [selected, setSelected] = useState(
    images?.[0]
  );

  return (
    <div>
      <div className="bg-white rounded-3xl overflow-hidden">
        <img
          src={selected}
          alt=""
          className="w-full h-[500px] object-contain p-4"
        />
      </div>

      <div className="flex gap-3 mt-4 flex-wrap">
        {images?.map((img, index) => (
          <button
            key={index}
            onClick={() => setSelected(img)}
            className={`border-2 rounded-xl overflow-hidden ${
              selected === img
                ? "border-pink-500"
                : "border-transparent"
            }`}
          >
            <img
              src={img}
              alt=""
              className="w-20 h-20 object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
}