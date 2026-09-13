import axiosInstance from "./axiosInstance";

export const uploadPdf = async (file) => {
  const formData = new FormData();
  formData.append("pdf", file);

  const response = await axiosInstance.post(
    "/pdfs/upload",
    formData
  );

  return response.data;
};

export const getMyPdfs = async () => {
  const response = await axiosInstance.get("/pdfs");

  return response.data;
};

export const deletePdf = async (pdfId) => {
  const response = await axiosInstance.delete(`/delete/${pdfId}`);

  return response.data;
};

