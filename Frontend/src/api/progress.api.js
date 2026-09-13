import axiosInstance from "./axiosInstance";

export const saveProgress = async ({
  pdfId,
  pageNumber,
  selectedText,
  surroundingText,
  position,
}) => {
  const response = await axiosInstance.post("/progress", {
    pdfId,
    pageNumber,
    selectedText,
    surroundingText,
    position,
  });

  return response.data;
};

export const getProgress = async (pdfId) => {
  const response = await axiosInstance.get(
    `/progress/${pdfId}`
  );

  return response.data;
};

export const getAllProgress = async () => {
    const response = await axiosInstance.get(
        "/progress/all"
    );

    return response.data;
};