import { useEffect, useRef, useState } from 'react';

function ImageCropPreview({
  imageFile,
  size,
  orientation,
  onSizeChange,
  onOrientationChange,
}) {
  const [imageUrl, setImageUrl] = useState('');
  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const dragging = useRef(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const startPosition = useRef({ x: 0, y: 0 });

  /*
   * Create a temporary browser URL for the uploaded image.
   */
  useEffect(() => {
    if (!imageFile) {
      setImageUrl('');
      return;
    }

    const url = URL.createObjectURL(imageFile);
    setImageUrl(url);

    return () => {
      URL.revokeObjectURL(url);
    };
  }, [imageFile]);

  /*
   * A-series paper dimensions.
   *
   * A4 = 210 × 297 mm
   * A3 = 297 × 420 mm
   * A2 = 420 × 594 mm
   *
   * All A-series sizes have the same aspect ratio.
   */
  const paperDimensions = {
    A4: {
      width: 210,
      height: 297,
    },

    A3: {
      width: 297,
      height: 420,
    },

    A2: {
      width: 420,
      height: 594,
    },
  };

  const dimensions =
    paperDimensions[size] || paperDimensions.A4;

  /*
   * Portrait:
   *   width / height
   *
   * Landscape:
   *   height / width
   */
  const aspectRatio =
    orientation === 'portrait'
      ? dimensions.width / dimensions.height
      : dimensions.height / dimensions.width;

  /*
   * The preview container uses a 4:3 aspect ratio.
   *
   * We want the artwork frame to be large without touching
   * the edges.
   *
   * Portrait:
   *   frame height = 88% of preview height
   *
   * Landscape:
   *   frame width = 88% of preview width
   *
   * The other dimension is calculated from the REAL
   * A-series aspect ratio.
   */

  const previewAspectRatio = 4 / 3;

  let frameWidthPercent;
  let frameHeightPercent;

  if (orientation === 'portrait') {
    frameHeightPercent = 88;

    /*
     * Frame width relative to preview width:
     *
     * preview width = 4/3 × preview height
     * frame width = frame height × aspect ratio
     */
    frameWidthPercent =
      (frameHeightPercent / 100) *
      aspectRatio /
      previewAspectRatio *
      100;
  } else {
    frameWidthPercent = 88;

    /*
     * Landscape frame height relative to preview height.
     */
    frameHeightPercent =
      (frameWidthPercent / 100) /
      aspectRatio *
      previewAspectRatio *
      100;
  }

  /*
   * Center the frame.
   */
  const frameLeftPercent =
    (100 - frameWidthPercent) / 2;

  const frameTopPercent =
    (100 - frameHeightPercent) / 2;

  /*
   * Drag handling.
   */
  const handlePointerDown = (e) => {
    e.preventDefault();

    dragging.current = true;

    dragStart.current = {
      x: e.clientX,
      y: e.clientY,
    };

    startPosition.current = {
      x: position.x,
      y: position.y,
    };

    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e) => {
    if (!dragging.current) return;

    const deltaX =
      e.clientX - dragStart.current.x;

    const deltaY =
      e.clientY - dragStart.current.y;

    setPosition({
      x: startPosition.current.x + deltaX,
      y: startPosition.current.y + deltaY,
    });
  };

  const handlePointerUp = (e) => {
    dragging.current = false;

    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
  };

  /*
   * Only a completely new image resets framing.
   *
   * Changing size or orientation does NOT reset
   * the customer's current framing.
   */
  useEffect(() => {
    setZoom(1);
    setPosition({
      x: 0,
      y: 0,
    });
  }, [imageFile]);

  if (!imageFile || !imageUrl) {
    return null;
  }

  return (
    <div className="mt-6">

      {/* ================================================== */}
      {/* SIZE + ORIENTATION                                */}
      {/* ================================================== */}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">

        {/* Artwork size */}
        <div>
          <label className="label">
            Artwork Size
          </label>

          <div className="flex gap-2 mt-2">

            {['A4', 'A3', 'A2'].map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => onSizeChange(option)}
                className={`px-4 py-2 text-sm border transition ${
                  size === option
                    ? 'bg-paper text-ink border-paper'
                    : 'border-line text-paper-mute hover:text-paper hover:border-paper/30'
                }`}
              >
                {option}
              </button>
            ))}

          </div>

          <p className="mt-2 text-xs text-mist">
            {orientation === 'portrait'
              ? `${dimensions.width} × ${dimensions.height} mm`
              : `${dimensions.height} × ${dimensions.width} mm`}
          </p>
        </div>


        {/* Orientation */}
        <div>
          <label className="label">
            Orientation
          </label>

          <div className="flex gap-2 mt-2">

            <button
              type="button"
              onClick={() =>
                onOrientationChange('portrait')
              }
              className={`px-4 py-2 text-sm border transition ${
                orientation === 'portrait'
                  ? 'bg-paper text-ink border-paper'
                  : 'border-line text-paper-mute hover:text-paper hover:border-paper/30'
              }`}
            >
              Portrait
            </button>

            <button
              type="button"
              onClick={() =>
                onOrientationChange('landscape')
              }
              className={`px-4 py-2 text-sm border transition ${
                orientation === 'landscape'
                  ? 'bg-paper text-ink border-paper'
                  : 'border-line text-paper-mute hover:text-paper hover:border-paper/30'
              }`}
            >
              Landscape
            </button>

          </div>

          <p className="mt-2 text-xs text-mist">
            {orientation === 'portrait'
              ? 'Portrait format'
              : 'Landscape format'}
          </p>
        </div>

      </div>


      {/* ================================================== */}
      {/* PREVIEW                                            */}
      {/* ================================================== */}

      <div className="border border-line bg-ink-soft p-4 sm:p-5">

        <div className="flex justify-center">

          <div
            className="relative w-full max-w-[560px] aspect-[4/3] overflow-hidden bg-[#080808] touch-none select-none cursor-grab active:cursor-grabbing"
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
          >

            {/* -------------------------------------------- */}
            {/* Reference image                              */}
            {/* -------------------------------------------- */}

            <img
              src={imageUrl}
              alt="Reference preview"
              draggable="false"
              className="absolute left-1/2 top-1/2 pointer-events-none select-none"
              style={{
                maxWidth: '100%',
                maxHeight: '100%',
                width: 'auto',
                height: 'auto',

                transform: `
                  translate(
                    calc(-50% + ${position.x}px),
                    calc(-50% + ${position.y}px)
                  )
                  scale(${zoom})
                `,

                transformOrigin: 'center center',
              }}
            />


            {/* -------------------------------------------- */}
            {/* OUTSIDE-FRAME OVERLAY                        */}
            {/* -------------------------------------------- */}

            {/* Top */}
            <div
              className="absolute bg-black/45 pointer-events-none"
              style={{
                left: 0,
                right: 0,
                top: 0,
                height: `${frameTopPercent}%`,
              }}
            />

            {/* Bottom */}
            <div
              className="absolute bg-black/45 pointer-events-none"
              style={{
                left: 0,
                right: 0,
                bottom: 0,
                height: `${frameTopPercent}%`,
              }}
            />

            {/* Left */}
            <div
              className="absolute bg-black/45 pointer-events-none"
              style={{
                left: 0,
                top: `${frameTopPercent}%`,
                bottom: `${frameTopPercent}%`,
                width: `${frameLeftPercent}%`,
              }}
            />

            {/* Right */}
            <div
              className="absolute bg-black/45 pointer-events-none"
              style={{
                right: 0,
                top: `${frameTopPercent}%`,
                bottom: `${frameTopPercent}%`,
                width: `${frameLeftPercent}%`,
              }}
            />


            {/* -------------------------------------------- */}
            {/* ARTWORK FRAME                                */}
            {/* -------------------------------------------- */}

            <div
              className="absolute pointer-events-none"
              style={{
                left: `${frameLeftPercent}%`,
                top: `${frameTopPercent}%`,

                width: `${frameWidthPercent}%`,
                height: `${frameHeightPercent}%`,

                border: '2px solid white',

                /*
                 * Black outer edge + white inner line.
                 *
                 * This keeps the frame visible against both
                 * bright and dark photographs.
                 */
                boxShadow:
                  '0 0 0 1.5px rgba(0,0,0,0.95), 0 0 12px rgba(0,0,0,0.35)',
              }}
            >

              {/* Top-left corner marker */}
              <span
                className="absolute -left-[4px] -top-[4px] w-4 h-4 border-l-[3px] border-t-[3px] border-black"
              />

              {/* Top-right corner marker */}
              <span
                className="absolute -right-[4px] -top-[4px] w-4 h-4 border-r-[3px] border-t-[3px] border-black"
              />

              {/* Bottom-left corner marker */}
              <span
                className="absolute -left-[4px] -bottom-[4px] w-4 h-4 border-l-[3px] border-b-[3px] border-black"
              />

              {/* Bottom-right corner marker */}
              <span
                className="absolute -right-[4px] -bottom-[4px] w-4 h-4 border-r-[3px] border-b-[3px] border-black"
              />

            </div>

          </div>

        </div>


        {/* ================================================== */}
        {/* INSTRUCTIONS                                      */}
        {/* ================================================== */}

        <div className="mt-4 text-center">

          <p className="text-sm text-paper">
            Frame your artwork
          </p>

          <p className="mt-1 text-xs leading-5 text-mist max-w-lg mx-auto">
            Drag to reposition the reference. Zoom out to
            include more of the photo, or zoom in for a
            closer composition.
          </p>

        </div>


        {/* ================================================== */}
        {/* ZOOM                                              */}
        {/* ================================================== */}

        <div className="mt-5 max-w-xl mx-auto">

          <div className="flex items-center justify-between mb-2">

            <label
              htmlFor="imageZoom"
              className="text-xs uppercase tracking-[0.18em] text-mist"
            >
              Zoom
            </label>

            <span className="text-xs text-paper-mute">
              {Math.round(zoom * 100)}%
            </span>

          </div>

          <div className="flex items-center gap-3">

            <span className="text-xs text-mist">
              50%
            </span>

            <input
              id="imageZoom"
              type="range"
              min="0.5"
              max="2"
              step="0.01"
              value={zoom}
              onChange={(e) =>
                setZoom(Number(e.target.value))
              }
              className="w-full accent-current"
            />

            <span className="text-xs text-mist">
              200%
            </span>

          </div>

        </div>


        {/* ================================================== */}
        {/* DISCLAIMER                                        */}
        {/* ================================================== */}

        <div className="mt-5 border border-line bg-[#111111] px-4 py-3">

          <p className="text-xs leading-5 text-mist">
            The outlined area is an approximate framing guide.
            The artist may make minor adjustments to achieve
            the best composition.
          </p>

        </div>

      </div>

    </div>
  );
}

export default ImageCropPreview;