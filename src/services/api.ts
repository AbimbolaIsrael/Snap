// api.ts for Azure SQL + Azure Blob

export interface Photo {
  id: string;
  url: string;
  title: string;
  caption: string;
  location: string;
  people: string;
  creator_id: string;
  creatorName: string;
  timestamp: string;
  comments: Comment[];
  ratings: Rating[];
}

export interface PhotoUpload {
  url: File; // Will be uploaded to Azure Blob
  title: string;
  caption: string;
  location: string;
  people: string;
  creator_id: string;
  creatorName: string;
}

export interface Comment {
  id: string;
  user_id: string;
  userName: string;
  comment: string;
  timestamp: string;
}

export interface Rating {
  user_id: string;
  rating: number;
}

const API_BASE = import.meta.env.VITE_API_BASE_URL || "https://snapshare.azurewebsites.net/api";
const STORAGE_ACCOUNT = import.meta.env.VITE_AZURE_STORAGE_ACCOUNT;
const SAS_TOKEN = import.meta.env.VITE_AZURE_SAS_TOKEN;

// 🟦 Upload File to Azure Blob Storage
const uploadToAzureBlob = async (file: File, container = 'photos') => {
  const blobUrl = `https://${STORAGE_ACCOUNT}.blob.core.windows.net/${container}/${file.name}${SAS_TOKEN}`;

  const response = await fetch(blobUrl, {
    method: 'PUT',
    headers: {
      'x-ms-blob-type': 'BlockBlob',
      'Content-Type': file.type
    },
    body: file
  });

  if (!response.ok) {
    throw new Error("Blob upload failed");
  }

  return blobUrl.split('?')[0]; // remove SAS token for public access
};

// Backend API Helper
const fetchFromAzure = async (endpoint: string, options: RequestInit = {}) => {
  const res = await fetch(`${API_BASE}/${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    },
    credentials: 'include'
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || `API error: ${res.status}`);
  }

  return await res.json();
};

// API Methods
export const api = {
  getPhotos: async (searchParams?: { title?: string; location?: string; people?: string }) => {
    let endpoint = 'photos';
    if (searchParams) {
      const params = new URLSearchParams(searchParams as any).toString();
      endpoint += `?${params}`;
    }
    return await fetchFromAzure(endpoint);
  },

  getPhoto: async (id: string) => {
    return await fetchFromAzure(`photos/${id}`);
  },

  uploadPhoto: async (photoData: PhotoUpload) => {
    const blobUrl = await uploadToAzureBlob(photoData.url);
    return await fetchFromAzure('photos', {
      method: 'POST',
      body: JSON.stringify({
        ...photoData,
        url: blobUrl,
        blob_path: blobUrl
      }),
    });
  },

  addComment: async (photoId: string, userId: string, userName: string, comment: string) => {
    return await fetchFromAzure(`photos/${photoId}/comments`, {
      method: 'POST',
      body: JSON.stringify({ user_id: userId, userName, comment }),
    });
  },

  ratePhoto: async (photoId: string, userId: string, rating: number) => {
    return await fetchFromAzure(`photos/${photoId}/ratings`, {
      method: 'POST',
      body: JSON.stringify({ user_id: userId, rating }),
    });
  }
};
