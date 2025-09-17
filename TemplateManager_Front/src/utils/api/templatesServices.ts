import axiosInstance from "./axios";

export type Template = {
  id: string;
  name: string;
  html: string;
  userId: string;
};

export const createTemplate = async (name: string, html: string): Promise<Template> => {
  try {
    const request = { name, html };
    const response = await axiosInstance.post("/Template/Create", request);
    return response.data as Template;
  } catch (error) {
    console.error("Помилка створення шаблону:", error);
    throw error;
  }
};

export const getTemplates = async (): Promise<Template[]> => {
  try {
    const response = await axiosInstance.get("/Template");
    return response.data as Template[];
  } catch (error) {
    console.error("Помилка отримання шаблонів:", error);
    throw error;
  }
};

export const updateTemplate = async (id: string, name: string, html: string): Promise<void> => {
  try {
    const request = { name, html };
    await axiosInstance.put(`/Template/Change/${id}`, request);
  } catch (error) {
    console.error("Помилка оновлення шаблону:", error);
    throw error;
  }
};

export const deleteTemplate = async (id: string): Promise<void> => {
  try {
    await axiosInstance.delete(`/Template/delete/${id}`);
  } catch (error) {
    console.error("Помилка видалення шаблону:", error);
    throw error;
  }
};

export const generatePdf = async (id: string, data: Record<string, string>): Promise<Blob> => {
  try {
    const response = await axiosInstance.post(
      `/Template/${id}/GeneratePdf`,
      { data },
      { responseType: "blob" } // PDF треба зберігати як файл
    );
    return response.data as Blob;
  } catch (error) {
    console.error("Помилка генерації PDF:", error);
    throw error;
  }
};
