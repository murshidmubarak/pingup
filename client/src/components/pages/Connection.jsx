import React, { useState, useRef, useCallback } from "react";
import Cropper from "react-easy-crop";
import { Upload, X, ChevronLeft, ChevronRight, Crop } from "lucide-react";

export default function SimplePostCreator() {
  const mainFileInputRef = useRef(null);
  const addMoreFileInputRef = useRef(null); // <-- NEW ref

  const [isOpen, setIsOpen] = useState(false);
  const [files, setFiles] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isCropping, setIsCropping] = useState(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const handleFiles = (fileList) => {
    if (!fileList) return;
    const arr = Array.from(fileList).map((file) => ({
      file,
      url: URL.createObjectURL(file),
      type: file.type.startsWith("video") ? "video" : "image",
      name: file.name,
    }));
    setFiles((prev) => [...prev, ...arr]);
  };

  const onMainFileInput = (e) => {
    handleFiles(e.target.files);
    e.target.value = null;
  };

  const onAddMoreInput = (e) => {
    handleFiles(e.target.files);
    e.target.value = null;
  };

  const onDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files?.length) handleFiles(e.dataTransfer.files);
  };
  const onDragOver = (e) => e.preventDefault();

  const removeFile = (index) => {
    setFiles((prev) => {
      const next = prev.filter((_, i) => i !== index);
      try {
        URL.revokeObjectURL(prev[index].url);
      } catch {}
      return next;
    });
  };

  const prevMedia = () => setCurrentIndex((i) => Math.max(0, i - 1));
  const nextMedia = () => setCurrentIndex((i) => Math.min(files.length - 1, i + 1));

  const onCropComplete = useCallback((_, areaPixels) => setCroppedAreaPixels(areaPixels), []);

  const createImage = (url) =>
    new Promise((res, rej) => {
      const img = new Image();
      img.onload = () => res(img);
      img.onerror = (e) => rej(e);
      img.crossOrigin = "anonymous";
      img.src = url;
    });

  const getCroppedImg = async (src, crop) => {
    const img = await createImage(src);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    canvas.width = crop.width;
    canvas.height = crop.height;
    ctx.drawImage(
      img,
      crop.x,
      crop.y,
      crop.width,
      crop.height,
      0,
      0,
      crop.width,
      crop.height
    );
    return await new Promise((resolve) => {
      canvas.toBlob((blob) => {
        const url = URL.createObjectURL(blob);
        resolve({ blob, url });
      }, "image/jpeg");
    });
  };

  const applyCrop = async () => {
    const cur = files[currentIndex];
    if (!cur || !croppedAreaPixels) return;
    const { url, blob } = await getCroppedImg(cur.url, croppedAreaPixels);
    setFiles((prev) =>
      prev.map((f, i) =>
        i === currentIndex
          ? {
              ...f,
              file: new File([blob], cur.name, { type: blob.type }),
              url,
            }
          : f
      )
    );
    setIsCropping(false);
    setZoom(1);
    setCrop({ x: 0, y: 0 });
  };

  const handlePost = () => {
    console.log("Posting", files);
    alert(`Posting ${files.length} file(s)!`);
    setIsOpen(false);
    setFiles([]);
  };

  return (
    <div>
      {!isOpen ? (
        <div className="h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-50">
          <button
            onClick={() => setIsOpen(true)}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold"
          >
            <Upload className="inline mr-2" size={16} />
            Create Post
          </button>
        </div>
      ) : 
      (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-3">
          <div className="bg-white w-full max-w-5xl rounded-2xl flex flex-col md:flex-row h-[85vh] overflow-hidden">
            {/* LEFT */}
            <div
              onDrop={onDrop}
              onDragOver={onDragOver}
              className="flex-1 bg-gray-900 relative flex items-center justify-center"
            >
              {files.length === 0 ? (
                <div className="text-white text-center">
                  <Upload size={50} className="mx-auto mb-4" />
                  <p className="mb-3">Drag & drop or click below</p>
                  <button
                    onClick={() => mainFileInputRef.current?.click()}
                    className="bg-purple-600 px-4 py-2 rounded-xl text-white"
                  >
                    Select files
                  </button>
                  <input
                    ref={mainFileInputRef}
                    type="file"
                    multiple
                    accept="image/*,video/*"
                    onChange={onMainFileInput}
                    className="hidden"
                  />
                </div>
              ) : (
                <>
                  {isCropping ? (
                    <div className="w-full h-full relative">
                      <Cropper
                        image={files[currentIndex].url}
                        crop={crop}
                        zoom={zoom}
                        aspect={1}
                        onCropChange={setCrop}
                        onZoomChange={setZoom}
                        onCropComplete={onCropComplete}
                      />
                      <div className="absolute bottom-4 left-4 flex gap-2">
                        <button
                          onClick={() => setIsCropping(false)}
                          className="bg-white px-3 py-1 rounded"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={applyCrop}
                          className="bg-purple-600 text-white px-3 py-1 rounded"
                        >
                          Save Crop
                        </button>
                      </div>
                    </div>
                  ) : files[currentIndex].type === "video" ? (
                    <video
                      src={files[currentIndex].url}
                      controls
                      className="max-h-[70vh] rounded-xl"
                    />
                  ) : (
                    <img
                      src={files[currentIndex].url}
                      className="max-h-[70vh] object-contain rounded-xl"
                    />
                  )}

                  {/* Controls */}
                  <div className="absolute top-4 right-4 flex gap-2">
                    {files[currentIndex].type === "image" && (
                      <button
                        onClick={() => setIsCropping(true)}
                        className="bg-white p-2 rounded-full"
                      >
                        <Crop size={16} />
                      </button>
                    )}
                    <button
                      onClick={() => removeFile(currentIndex)}
                      className="bg-red-500 text-white p-2 rounded-full"
                    >
                      <X size={16} />
                    </button>
                  </div>

                  {/* Navigation */}
                  {files.length > 1 && currentIndex > 0 && (
                    <button
                      onClick={prevMedia}
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/70 p-2 rounded-full"
                    >
                      <ChevronLeft size={16} />
                    </button>
                  )}
                  {files.length > 1 && currentIndex < files.length - 1 && (
                    <button
                      onClick={nextMedia}
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/70 p-2 rounded-full"
                    >
                      <ChevronRight size={16} />
                    </button>
                  )}
                </>
              )}
            </div>

            {/* RIGHT */}
            <div className="w-full md:w-96 bg-gradient-to-b from-purple-50 to-pink-50 flex flex-col">
              <div className="p-4 border-b flex justify-between">
                <h3 className="font-semibold">Create post</h3>
                <button onClick={() => setIsOpen(false)}>
                  <X />
                </button>
              </div>
              <div className="p-4 flex-1 overflow-auto">
                <textarea
                  placeholder="Write caption..."
                  className="w-full border rounded-lg p-2 h-28"
                />
                <div className="flex gap-2 mt-3 overflow-x-auto">
                  {/* Add More */}
                  <button
                    onClick={() => addMoreFileInputRef.current?.click()}
                    className="w-16 h-16 flex-shrink-0 border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center text-gray-500"
                  >
                    <Upload size={18} />
                  </button>
                  <input
                    ref={addMoreFileInputRef}
                    type="file"
                    multiple
                    accept="image/*,video/*"
                    onChange={onAddMoreInput}
                    className="hidden"
                  />

                  {/* Thumbnails */}
                  {files.map((f, i) =>
                    f.type === "video" ? (
                      <video
                        key={i}
                        src={f.url}
                        onClick={() => setCurrentIndex(i)}
                        className={`w-16 h-16 object-cover rounded-xl cursor-pointer ${
                          i === currentIndex ? "ring-4 ring-purple-500" : ""
                        }`}
                      />
                    ) : (
                      <img
                        key={i}
                        src={f.url}
                        onClick={() => setCurrentIndex(i)}
                        className={`w-16 h-16 object-cover rounded-xl cursor-pointer ${
                          i === currentIndex ? "ring-4 ring-purple-500" : ""
                        }`}
                      />
                    )
                  )}
                </div>
              </div>
              <div className="p-4 border-t">
                <button
                  onClick={handlePost}
                  className="w-full py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg"
                >
                  Share
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
