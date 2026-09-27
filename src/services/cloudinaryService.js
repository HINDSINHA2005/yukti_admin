/**
 * Cloudinary Direct Media Upload Service
 * Supports unsigned upload preset directly from browser
 */

export function getCloudinaryConfig() {
  const customConfigStr = localStorage.getItem('yukti_admin_cloudinary_config');
  if (customConfigStr) {
    try {
      return JSON.parse(customConfigStr);
    } catch (e) {
      console.error('Invalid custom Cloudinary config:', e);
    }
  }

  return {
    cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || '',
    uploadPreset: import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || ''
  };
}

/**
 * Uploads a file (Image / Video / PDF) to Cloudinary
 * @param {File} file
 * @param {'image' | 'video' | 'auto'} resourceType
 * @returns {Promise<{ url: string, secure_url: string, public_id: string }>}
 */
export async function uploadToCloudinary(file, resourceType = 'auto') {
  const { cloudName, uploadPreset } = getCloudinaryConfig();

  if (!cloudName || !uploadPreset) {
    throw new Error('Cloudinary is not configured yet. Please enter your Cloud Name and Upload Preset in Settings tab.');
  }

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', uploadPreset);
  formData.append('folder', 'yukti_software');

  const endpoint = `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`;

  const response = await fetch(endpoint, {
    method: 'POST',
    body: formData
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData?.error?.message || `Upload failed with HTTP ${response.status}`);
  }

  const result = await response.json();
  return {
    url: result.secure_url || result.url,
    secure_url: result.secure_url,
    public_id: result.public_id,
    width: result.width,
    height: result.height,
    format: result.format
  };
}
