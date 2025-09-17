import { useMutation, useQuery } from "@tanstack/react-query";
import { createTemplate, deleteTemplate, getTemplates, updateTemplate } from "./templatesServices";


export function useTemplates() {
  return useQuery({
    queryKey: ["templates"],
    queryFn: getTemplates, // без setTemplates!
  });
}

export function useDeleteTemplate() {
    return useMutation({
      mutationFn: async (projId: string) => {
        await deleteTemplate(projId);
        return projId;
      },
      onError: (error: Error) => {
        console.error("Delete failed:", error.message);
      },
      onSuccess: (projId) => {
        console.log("Template deleted successfully:", projId);      },
    });
}
  
export function useAddTemplate() {
    return useMutation({
        mutationFn: async ({
            tempName,
            html,
        }: {
            tempName: string;
            html: string;
        }) => {
            const newTemplate = await createTemplate(tempName, html);
            return newTemplate; // повертаємо новий шаблон для onSuccess
        },
        onError: (error: Error) => {
            console.error(error.message);
        },
        onSuccess: (newTemplate) => {
            console.log("Template added successfully");
    },

})
};

export function useUpdateTemplate() { 
    return useMutation({
        mutationFn: async ({
          tempId,
          tempName,
          html,
        }: {
          tempId: string;
          tempName: string;
          html: string;
        }) => {
          await updateTemplate(tempId, tempName, html);
          return { tempId, tempName, html };
        },
        onError: (error: Error) => {
          console.error(error.message);
        },
        onSuccess: ({ tempId, tempName, html }) => {
          console.log("Template updated successfully");
        },
      });
}
