import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import './storyAddModal.css';
import { X, Image as ImageIcon } from 'lucide-react';
import Cropper from 'react-easy-crop';
import { useNavigate } from "react-router-dom";
import api from '../api/axios';
import { fetchUser } from "../features/user/userSlice";
import { postStory,uploadStoryChunk,mergeStoryChunks } from '../features/story/storySlice';

const StoryAddModal = () => {
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const currentUser = useSelector((state) => state.user.value);
  const [user, setUser] = useState({});

  // Modal logic
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState("image");
  const [selectedFile, setSelectedFile] = useState(null);

  // Cropper logic
  const [cropping, setCropping] = useState(false);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);

  useEffect(() => {
    const initializeProfile = async () => {
      setLoading(true);
      const token = localStorage.getItem("token");

      if (token && !currentUser) {
        const fetchedUser = await dispatch(fetchUser(token)).unwrap();
        setUser(fetchedUser);
      } else if (currentUser) {
        setUser(currentUser);
      }

      setLoading(false);
    };
    initializeProfile();
  }, [currentUser, dispatch]);


    const CHUNK_SIZE = 5 * 1024 * 1024; // 5MB
  
  const uploadFileInChunks = async (file) => {
    const totalChunks = Math.ceil(file.size / CHUNK_SIZE);
    const fileId = `${file.name}-${file.size}-${Date.now()}`;
  
    for (let chunkIndex = 0; chunkIndex < totalChunks; chunkIndex++) {
      const start = chunkIndex * CHUNK_SIZE;
      const end = Math.min(start + CHUNK_SIZE, file.size);
      const chunk = file.slice(start, end);
  
      const fd = new FormData();
      fd.append("chunk", chunk);
      fd.append("chunkIndex", chunkIndex);
      fd.append("totalChunks", totalChunks);
      fd.append("fileId", fileId);
      fd.append("fileName", file.name);

      await dispatch(uploadStoryChunk(fd)).unwrap();
      
  
      // await api.post("/upload-chunk", fd);
    }
  
    // const res = await api.post("/merge-chunks", { fileId, totalChunks, fileName: file.name });
    const res = await dispatch(mergeStoryChunks({ fileId, totalChunks, fileName: file.name })).unwrap();
    return res.url;
  };




  // Upload Post
  const handlePostSubmit = async () => {
    setLoading(true);
    try {
      let uploadedMedia = [];
  
      // Upload each file (chunk upload)
      for (const file of media) {
        const url = await uploadFileInChunks(file);  // ← we now USE the returned URL
  
        uploadedMedia.push({
          url,
          type: file.type.startsWith("video") ? "video" : "image"
        });
      }
      console.log("Uploaded Media:", uploadedMedia);
  
      // Create post with media URLs
      // await api.post("/createPost", {
      //   content,
      //   media: JSON.stringify(uploadedMedia)
      // });
      await dispatch(postStory({ media: JSON.stringify(uploadedMedia) })).unwrap();
  
      navigate("/");
  
    } catch (error) {
      alert(error.response?.data?.message || "Error creating post");
    }
  
    setLoading(false);
  };


  // Cropper
  const getCroppedImg = async (imageSrc, croppedAreaPixels) => {
    const createImage = (url) =>
      new Promise((resolve, reject) => {
        const image = new window.Image();
        image.src = url;
        image.onload = () => resolve(image);
        image.onerror = reject;
      });

    const image = await createImage(imageSrc);
    const canvas = document.createElement("canvas");
    canvas.width = croppedAreaPixels.width;
    canvas.height = croppedAreaPixels.height;
    const ctx = canvas.getContext("2d");

    ctx.drawImage(
      image,
      croppedAreaPixels.x,
      croppedAreaPixels.y,
      croppedAreaPixels.width,
      croppedAreaPixels.height,
      0,
      0,
      croppedAreaPixels.width,
      croppedAreaPixels.height
    );

    return new Promise((resolve) => {
      canvas.toBlob((blob) => resolve(blob), "image/jpeg");
    });
  };

  const handleCropSave = async () => {
    if (!selectedFile || !croppedAreaPixels) return;

    const croppedBlob = await getCroppedImg(
      URL.createObjectURL(selectedFile),
      croppedAreaPixels
    );

    const croppedFile = new File([croppedBlob], selectedFile.name, {
      type: "image/jpeg",
    });

    setMedia(media.map((m) => (m === selectedFile ? croppedFile : m)));
    setCropping(false);
    setModalOpen(false);
    setSelectedFile(null);
  };

  // Modal Renderer
  const renderModal = () => {
    if (!modalOpen || !selectedFile) return null;

    return (
      <div className="modal-overlay">
        <div className="modal-content">
          <button
            className="close-button"
            onClick={() => {
              setModalOpen(false);
              setSelectedFile(null);
              setCropping(false);
            }}
          >
            <X size={22} />
          </button>

          {modalType === "video" ? (
            <video
              src={URL.createObjectURL(selectedFile)}
              controls
              className="modal-media"
            />
          ) : (
            <>
              {!cropping ? (
                <img
                  src={URL.createObjectURL(selectedFile)}
                  alt="preview"
                  className="modal-media"
                />
              ) : (
                <div className="cropper-container">
                  <Cropper
                    image={URL.createObjectURL(selectedFile)}
                    crop={crop}
                    zoom={zoom}
                    aspect={1}
                    onCropChange={setCrop}
                    onZoomChange={setZoom}
                    onCropComplete={(_, areaPixels) =>
                      setCroppedAreaPixels(areaPixels)
                    }
                  />
                </div>
              )}

              <div className="modal-buttons">
                {!cropping ? (
                  <button className="post-button" onClick={() => setCropping(true)}>
                    Crop
                  </button>
                ) : (
                  <>
                    <button className="post-button" onClick={handleCropSave}>
                      Save
                    </button>
                    <button
                      className="post-button cancel-button"
                      onClick={() => setCropping(false)}
                    >
                      Cancel
                    </button>
                  </>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="createpost-page">
      <div className="createpost-container">
        <div className="createpost-header">
          <h1>Add Your Story</h1>
          <p>Share your moment</p>
        </div>

        <div className="createpost-form">
          <div className="createpost-user">
            <img
              src={user?.profile_picture || "https://via.placeholder.com/100"}
              className="user-avatar"
              alt=""
            />
            <div>
              <h2>{user?.full_name}</h2>
              <p>@{user?.username}</p>
            </div>
          </div>

          {/* Media Preview */}
          {media.length > 0 && (
            <div className="images-preview">
              {media.map((file, i) => {
                const isVideo = file.type.startsWith("video/");
                return (
                  <div key={i} className="image-item">
                    {isVideo ? (
                      <video
                        src={URL.createObjectURL(file)}
                        className="preview-video"
                        onClick={() => {
                          setModalOpen(true);
                          setModalType("video");
                          setSelectedFile(file);
                        }}
                      />
                    ) : (
                      <img
                        src={URL.createObjectURL(file)}
                        className="preview-image"
                        onClick={() => {
                          setModalOpen(true);
                          setModalType("image");
                          setSelectedFile(file);
                        }}
                      />
                    )}

                    <div
                      className="remove-image"
                      onClick={() =>
                        setMedia(media.filter((_, index) => index !== i))
                      }
                    >
                      <X className="remove-icon" />
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {renderModal()}

          <div className="createpost-footer">
            <label htmlFor="media" className="upload-label">
              <ImageIcon className="icon" />
              <span>Add Images/Videos</span>
            </label>

            <input
              type="file"
              id="media"
              hidden
              multiple
              accept="image/*,video/*"
              onChange={(e) => setMedia([...media, ...Array.from(e.target.files)])}
            />

            <button
              className="post-button"
              disabled={loading}
              onClick={handlePostSubmit}
            >
              {loading ? "Uploading..." : "Upload Story"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoryAddModal;
