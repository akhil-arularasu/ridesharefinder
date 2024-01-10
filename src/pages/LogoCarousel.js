import React, { useEffect } from 'react';
import './LogoCarousel.css'; // Adjust the path as needed

const LogoCarousel = () => {
  useEffect(() => {
    const copy = document.querySelector(".logos-slide").cloneNode(true);
    document.querySelector(".logos").appendChild(copy);
  }, []);

  return (
    <div className="logos">
      <div className="logos-slide">
      <img src="./RSF-Logo-full.png" alt="3M" />
      <img src="./Emory-University-Logo.png" alt="3E" />
      <img src="./Oxfordcollegelogo.svg.png" alt="3Ox" />
      <img src="./RSF-Logo-full.png" alt="3M" />
      <img src="./Emory-University-Logo.png" alt="3E" />
      <img src="./Oxfordcollegelogo.svg.png" alt="3Ox" />

      </div>
    </div>
  );
};

export default LogoCarousel;
