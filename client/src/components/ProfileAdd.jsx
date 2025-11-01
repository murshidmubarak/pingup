// // src/components/ProfileAdd/ProfileAdd.jsx
// import React, { useRef, useState } from 'react';
// import Cropper from 'react-cropper';
// import 'cropperjs/dist/cropper.css';
// import './ProfileAdd.css';

// const ProfileAdd = ({ isOpen, onClose, onSave }) => {
//   const cropperRef = useRef(null);
//   const [image, setImage] = useState(null);

//   const handleFileChange = (e) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onload = () => setImage(reader.result);
//       reader.readAsDataURL(file);
//     }
//   };

//   const handleSave = () => {
//     const cropper = cropperRef.current?.cropper;
//     if (cropper) {
//       const croppedDataUrl = cropper
//         .getCroppedCanvas({
//           width: 300,
//           height: 300,
//         })
//         .toDataURL('image/jpeg');
//       onSave(croppedDataUrl); // base64 image sent to parent
//       onClose();
//     }
//   };

//   if (!isOpen) return null;

//   return (
//     <div className="profileadd-overlay" onClick={onClose}>
//       <div className="profileadd-modal" onClick={(e) => e.stopPropagation()}>
//         <h2 className="profileadd-title">Change Profile Photo</h2>

//         {!image ? (
//           <div className="upload-section">
//             <label htmlFor="file-upload" className="upload-btn">
//               Choose Image
//             </label>
//             <input
//               id="file-upload"
//               type="file"
//               accept="image/*"
//               onChange={handleFileChange}
//               style={{ display: 'none' }}
//             />
//           </div>
//         ) : (
//           <Cropper
//             ref={cropperRef}
//             src={image}
//             style={{ height: 350, width: '100%', borderRadius: '10px' }}
//             aspectRatio={1}
//             guides={false}
//             viewMode={1}
//             background={false}
//             autoCropArea={1}
//           />
//         )}

//         <div className="profileadd-actions">
//           <button onClick={onClose} className="cancel-btn">Cancel</button>
//           {image && <button onClick={handleSave} className="save-btn">Save</button>}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProfileAdd;




// src/components/ProfileAdd/ProfileAdd.jsx
import React, { useRef, useState } from 'react';
import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.css';
import './ProfileAdd.css';

const ProfileAdd = ({ isOpen, onClose, onSave }) => {
  const cropperRef = useRef(null);
  const [image, setImage] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    const cropper = cropperRef.current?.cropper;
    if (cropper) {
      const croppedDataUrl = cropper
        .getCroppedCanvas({
          width: 300,
          height: 300,
        })
        .toDataURL('image/jpeg');
      onSave(croppedDataUrl); // base64 image sent to parent
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="profileadd-overlay" onClick={onClose}>
      <div className="profileadd-modal" onClick={(e) => e.stopPropagation()}>
        <h2 className="profileadd-title">Change Profile Photo</h2>

          <div className="upload-section">
            <label htmlFor="file-upload" className="upload-btn">
              Choose Image
            </label>
            <input
              id="file-upload"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              style={{ display: 'none' }}
            />
          </div>
          <Cropper
            ref={cropperRef}
            src={image}
            style={{ height: 350, width: '100%', borderRadius: '10px' }}
            aspectRatio={1}
            guides={false}
            viewMode={1}
            background={false}
            autoCropArea={1}
          />
        

        <div className="profileadd-actions">
          <button onClick={onClose} className="cancel-btn">Cancel</button>
          {image && <button onClick={handleSave} className="save-btn">Save</button>}
        </div>
      </div>
    </div>
  );
};

export default ProfileAdd;

