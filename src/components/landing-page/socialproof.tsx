"use client";
import React, { useState } from "react";
import Image from "next/image";
const SocialProof = () => {
  const [userCount, setUserCount] = useState(0);
  const [userImages, setUserImages] = useState<{ image: string }[]>([]);
//   useEffect(() => {
//     fetch("/api/usercount")
//       .then((res) => res.json())
//       .then((data) => {
//         setUserCount(data.count);
//         setUserImages(data.images);
//       });
//   }, []);
  return (
    <div className="flex flex-col items-center mt-12">
      <div className="flex -space-x-2 mb-4">
        {userImages.map((image, i) => (
          <div key={image.image} className="relative w-10 h-10">
            <Image
              src={image.image}
              alt={`User ${i + 1}`}
              className="rounded-full border-2 border-white"
              fill
              sizes="40px"
            />
          </div>
        ))}
        {userImages.length === 0
          ? [...Array(1)].map((_, i) => (
              <div key={i} className="relative w-10 h-10">
                <Image
                  src="/vercel.svg"
                  alt={`User ${i + 1}`}
                  className="rounded-full border-2 border-white"
                  fill
                  sizes="40px"
                />
              </div>
            ))
          : null}
      </div>
      <p className="text-lg">
        <span className="font-semibold">{userCount ? userCount : 0}</span>{" "}
        users are already using this app
      </p>
    </div>
  );
};

export default SocialProof;
