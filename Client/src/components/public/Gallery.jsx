import React from 'react'

const Gallery = React.forwardRef((props, ref) => {
  return (
    <div>
        <div ref={ref} className='gallery-section-container'>
            <h3>Gallery</h3>
        </div>
    </div>
  )
})

export default Gallery
