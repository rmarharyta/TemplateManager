// import axiosInstance from "./api/axios";

// export const generatePdf = async (
//   id: string,
//   data: Record<string, string>
// ): Promise<Blob> => {
//   try {
//     const response = await axiosInstance.post(
//       `/Template/${id}/GeneratePdf`,
//       { data },                    
//       { responseType: "blob" }      // PDF повертається як Blob
//     );
//     return response.data as Blob;
//   } catch (error) {
//     console.error("Помилка генерації PDF:", error);
//     throw error;
//   }
// };
