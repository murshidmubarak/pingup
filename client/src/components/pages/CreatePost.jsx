

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import './CreatePost.css';
import { X, Image as ImageIcon } from 'lucide-react';
import Cropper from 'react-easy-crop';
import { fetchUser } from '../../features/user/userSlice';
import { useNavigate } from "react-router-dom";
import api from '../../api/axios';

const CreatePost = () => {
  const [content, setContent] = useState('');
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

  // Cropper Logic
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

  // ---------------------- CHUNK UPLOAD LOGIC ----------------------
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

    await api.post("/upload-chunk", fd);
  }

  const res = await api.post("/merge-chunks", { fileId, totalChunks, fileName: file.name });
  return res.data.url;
};


  // ---------------------- POST SUBMIT ----------------------
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

    // Create post with media URLs
    await api.post("/createPost", {
      content,
      media: JSON.stringify(uploadedMedia)
    });

    navigate("/");

  } catch (error) {
    alert(error.response?.data?.message || "Error creating post");
  }

  setLoading(false);
};





  // ---------------------- CROPPER ----------------------
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
    const croppedBlob = await getCroppedImg(URL.createObjectURL(selectedFile), croppedAreaPixels);
    const croppedFile = new File([croppedBlob], selectedFile.name, { type: "image/jpeg" });

    setMedia(media.map((m) => (m === selectedFile ? croppedFile : m)));
    setCropping(false);
    setModalOpen(false);
    setSelectedFile(null);
  };

  // ---------------------- MODAL ----------------------
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
            aria-label="Close"
          >
            <X size={22} color="#444" />
          </button>

          {modalType === "video" ? (
            <video
              src={URL.createObjectURL(selectedFile)}
              controls
              autoPlay
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
                    onCropComplete={(_, areaPixels) => setCroppedAreaPixels(areaPixels)}
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
                      Save Crop
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

  // ---------------------- UI ----------------------
  return (
    <div className="createpost-page">
      <div className="createpost-container">
        <div className="createpost-header">
          <h1>Create Post</h1>
          <p>Whats your mind</p>
        </div>

        <div className="createpost-form">
          <div className="createpost-user">
            <img
              src={user?.profile_picture || "https://via.placeholder.com/100"}
              className="user-avatar"
              alt="User Avatar"
            />
            <div>
              <h2>{user?.full_name || "Loading..."}</h2>
              <p>@{user?.username || "username"}</p>
            </div>
          </div>

          <textarea
            className="post-textarea"
            placeholder="Write your description..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />

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
                        controls={false}
                        className="preview-video"
                        style={{
                          width: '80px',
                          height: '80px',
                          objectFit: 'cover',
                          borderRadius: '8px',
                          border: '1px solid #e5e7eb'
                        }}
                        onClick={() => {
                          setModalOpen(true);
                          setModalType("video");
                          setSelectedFile(file);
                        }}
                      />
                    ) : (
                      <img
                        src={URL.createObjectURL(file)}
                        alt="preview"
                        className="preview-image"
                        style={{
                          width: '80px',
                          height: '80px',
                          objectFit: 'cover',
                          borderRadius: '8px',
                          border: '1px solid #e5e7eb'
                        }}
                        onClick={() => {
                          setModalOpen(true);
                          setModalType("image");
                          setSelectedFile(file);
                          setCropping(false);
                        }}
                      />
                    )}
                    <div
                      onClick={() =>
                        setMedia(media.filter((_, index) => index !== i))
                      }
                      className="remove-image"
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
              accept="image/*,video/*"
              multiple
              hidden
              onChange={(e) =>
                setMedia([...media, ...Array.from(e.target.files)])
              }
            />
            <button onClick={handlePostSubmit} className="post-button" disabled={loading}>
              {loading ? "Posting..." : "Post"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePost;