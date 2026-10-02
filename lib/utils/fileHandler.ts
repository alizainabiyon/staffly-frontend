import { apiClient } from '../services/api';
import { API_ENDPOINTS, LOCAL_STORAGE_KEYS } from './constants';
import { getLocalStorage } from './helpers';

// Helper function to get auth token and set it in API client
function getAuthToken(): string {
  const token = getLocalStorage(LOCAL_STORAGE_KEYS.AUTH_TOKEN, null);
  if (!token) {
    throw new Error('Authentication token not found');
  }
  
  // Set the token in the API client for other requests
  apiClient.setAuthToken(token);
  
  return token;
}

// Types for file handler responses
export interface FileUploadResponse {
  status: {
    code: number;
    success: boolean;
  };
  response: {
    message: string;
    data: string; // URL of uploaded file
  };
}

export interface FileDeleteResponse {
  status: {
    code: number;
    success: boolean;
  };
  response: {
    message: string;
    data: Record<string, any>;
  };
}

export interface MultipleFileUploadResponse {
  status: {
    code: number;
    success: boolean;
  };
  response: {
    message: string;
    data: string[]; // Array of URLs of uploaded files
  };
}

/**
 * Upload a single file to the server
 * @param file - The file to upload
 * @returns Promise with the upload response containing the file URL
 */
export async function uploadSingleFile(file: File): Promise<FileUploadResponse> {
  try {
    const formData = new FormData();
    formData.append('file', file); // Use 'file' as the key name like in Postman

    // Get the auth token and set it in API client
    const token = getAuthToken();

    // Use the API base URL from environment or default
    const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4242/api';
    const url = `${baseURL}${API_ENDPOINTS.FILE_HANDLER.UPLOAD_SINGLE}`;

    const response = await fetch(url, {
      method: 'POST',
      body: formData,
      headers: {
        'Authorization': `Bearer ${token}`,
        // Don't set Content-Type for FormData, let browser set it with boundary
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data as FileUploadResponse;
  } catch (error) {
    throw new Error('Failed to upload file');
  }
}

/**
 * Delete a single file from the server
 * @param fileUrl - The URL of the file to delete
 * @returns Promise with the delete response
 */
export async function deleteSingleFile(fileUrl: string): Promise<FileDeleteResponse> {
  try {
    const response = await apiClient.post(
      API_ENDPOINTS.FILE_HANDLER.DELETE_SINGLE,
      { fileUrl }
    );

    return response.response.data as FileDeleteResponse;
  } catch (error) {
    throw new Error('Failed to delete file');
  }
}

/**
 * Upload multiple files to the server
 * @param files - Array of files to upload
 * @returns Promise with the upload response containing array of file URLs
 */
export async function uploadMultipleFiles(files: File[]): Promise<MultipleFileUploadResponse> {
  try {
    const formData = new FormData();
    
    files.forEach((file) => {
      formData.append('files', file); // Use 'files' as the key name for multiple files
    });

    // Get the auth token and set it in API client
    const token = getAuthToken();

    // Use the API base URL from environment or default
    const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4242/api';
    const url = `${baseURL}${API_ENDPOINTS.FILE_HANDLER.UPLOAD_MULTIPLE}`;

    const response = await fetch(url, {
      method: 'POST',
      body: formData,
      headers: {
        'Authorization': `Bearer ${token}`,
        // Don't set Content-Type for FormData, let browser set it with boundary
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data as MultipleFileUploadResponse;
  } catch (error) {
    throw new Error('Failed to upload files');
  }
}

/**
 * Delete multiple files from the server
 * @param fileUrls - Array of file URLs to delete
 * @returns Promise with the delete response
 */
export async function deleteMultipleFiles(fileUrls: string[]): Promise<FileDeleteResponse> {
  try {
    const response = await apiClient.post(
      API_ENDPOINTS.FILE_HANDLER.DELETE_MULTIPLE,
      { fileUrls }
    );

    return response.response.data as FileDeleteResponse;
  } catch (error) {
    throw new Error('Failed to delete files');
  }
} 