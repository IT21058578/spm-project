import React from "react";
import banner3 from "../assets/img/banner3.jpg";
const Banner = ({ page, path }: { page: string; path: string[] }) => {
  return (
    <div
      className="d-flex flex-wrap justify-content-between p-5 align-items-center"
      style={{
        height: "200px",
        backgroundImage: `url(${banner3})`,
        backgroundSize: "cover",
      }}
    >
      <h2 className="fw-bold mb-4 mb-lg-0">{page}</h2>
      <h5 className="fw-bold">{path.join(" > ")}</h5>
    </div>
  );
};

export default Banner;
