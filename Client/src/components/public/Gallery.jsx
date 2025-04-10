import React, { useRef } from "react";

const Gallery = React.forwardRef((props, ref) => {
  const galleryRef = useRef(null);

  // Function to handle scrolling
  const scrollGallery = (direction) => {
    if (galleryRef.current) {
      const scrollAmount = 300; // Adjust scroll distance as needed
      galleryRef.current.scrollLeft += direction === "left" ? -scrollAmount : scrollAmount;
    }
  };

  return (
    <div ref={ref} className="gallery-section-container">
      <h3>Gallery</h3>
      
      {/* Scroll Buttons */}
      <button className="scroll-btn left-btn" onClick={() => scrollGallery("left")}>
        &#8249;
      </button>

      <div className="gallery-wrapper" ref={galleryRef}>
        {/* Images Row */}
        <div className="media-row">
          <div className="image-block">Image 1</div>
          <div className="image-block">Image 2</div>
          <div className="image-block">Image 3</div>
          <div className="image-block">Image 4</div>
          <div className="image-block">Image 5</div>
        </div>

        {/* Videos Row */}
        <div className="media-row">
          <div className="vid-block">Video 1</div>
          <div className="vid-block">Video 2</div>
          <div className="vid-block">Video 3</div>
          <div className="vid-block">Video 4</div>
          <div className="vid-block">Video 5</div>
        </div>
      </div>

      <button className="scroll-btn right-btn" onClick={() => scrollGallery("right")}>
        &#8250;
      </button>
    </div>
  );
});

export default Gallery;
