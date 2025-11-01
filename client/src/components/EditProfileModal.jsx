import React from "react";
// import "./EditProfileModal.css";

const EditProfileModal = ({ user, isOpen, onClose, onOpenCrop }) => {


  if (!isOpen) return null; // don't render if not open
  

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Edit Profile</h2>
          <button onClick={onClose} className="modal-close">×</button>
        </div>

        <div className="modal-body">
          <div className="modal-avatar">
            <div className="avatar-preview">
              <img
                src={user.profile_picture || "https://via.placeholder.com/150"}
                alt={user.full_name}
              />
            </div>
            <button className="change-avatar-btn" onClick={onOpenCrop}>
              Change Profile Photo
            </button>
          </div>

          <div className="modal-form">
            <div className="form-group">
              <label>Name</label>
              <input type="text" defaultValue={user.full_name} />
            </div>
            <div className="form-group">
              <label>Username</label>
              <input type="text" defaultValue={user.username} />
            </div>
            <div className="form-group">
              <label>Bio</label>
              <textarea defaultValue={user.bio} rows="3" />
            </div>
          </div>

          <button onClick={onClose} className="save-btn">
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditProfileModal;
