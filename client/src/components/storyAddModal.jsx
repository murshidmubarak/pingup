import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import './storyAddModal.css';
import { X, Image as ImageIcon } from 'lucide-react';
import Cropper from 'react-easy-crop';
import { useNavigate } from "react-router-dom";
import api from '../api/axios';
import { fetchUser } from "../features/user/userSlice";

const CreatePost = () => {
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

  // Upload Post
  const handlePostSubmit = async () => {
    setLoading(true);
    try {
      const formData = new FormData();
      media.forEach(file => formData.append("files", file));

      const res = await api.post("/createPost", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      alert("Post created successfully!");
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

export default CreatePost;
