import React, { useEffect, useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Container,
  Box,
  Button,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import LogoutIcon from "@mui/icons-material/Logout";
import AddIcon from "@mui/icons-material/Add";
import { generatePdf, Template } from "../utils/api/templatesServices";
import TemplateList from "../components/TemplateList";
import TemplateForm from "../components/TemplateForm";
import {
  useAddTemplate,
  useDeleteTemplate,
  useTemplates,
  useUpdateTemplate,
} from "../utils/api/useTemplateMutation";
import { useLogout } from "../utils/api/useUserMutation";

export default function Home() {
  const navigate = useNavigate();
  const { mutate: mutateExit } = useLogout();

  const [templates, setTemplates] = useState<Template[]>([]);

  const { mutateAsync: deleteTemplateMutate } = useDeleteTemplate();
  const { mutateAsync: addTemplateMutate, isPending: isPendingAddTemplates } =
    useAddTemplate();

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState<boolean>(false);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(
    null
  );

  const {
    mutateAsync: updateTemplateMutate,
    isPending: isPendingChangeTemplate,
  } = useUpdateTemplate();

  const { data: templatesQuery, isLoading, refetch } = useTemplates();
  useEffect(() => {
    if (templatesQuery) {
      setTemplates(templatesQuery);
    }
  }, [templatesQuery]);

  const handleCreateNote = (newTemplate: Template) => {
    addTemplateMutate({
      tempName: newTemplate.name,
      html: newTemplate.html,
    });
    setTemplates((template) => [...template, newTemplate]);
    setIsCreateDialogOpen(false);
  };

  const handleUpdateNote = (template: Template) => {
    updateTemplateMutate({
      tempId: template.id,
      tempName: template.name,
      html: template.html,
    });
    setSelectedTemplate(null);
    setTemplates(
      templates.map((p) =>
        p.id === template.id
          ? { ...p, name: template.name, html: template.html }
          : p
      )
    );
    setIsCreateDialogOpen(false);
  };

  const handleDelete = async (id: string) => {
    await deleteTemplateMutate(id);
    setTemplates(templates.filter((p) => p.id !== id));
  };

  const handleGeneratePdf = async (id: string) => {
    try {
      //open file
      const blob = await generatePdf(id, {});
      const url = window.URL.createObjectURL(blob);
      window.open(url);

      // download file
      const a = document.createElement("a");
      a.href = url;
      a.download = `template-${id}.pdf`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error generating PDF:", error);
    }
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Template Manager
          </Typography>
          <Button
            color="inherit"
            startIcon={<AddIcon />}
            onClick={() => {
              setIsCreateDialogOpen(true);
            }}
          >
            New
          </Button>
          <IconButton
            color="inherit"
            onClick={() =>
              mutateExit(undefined, {
                onSuccess: () => navigate("/"),
                onError: (error) => console.log("Error:", error),
              })
            }
            edge="end"
          >
            <LogoutIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Container sx={{ mt: 3 }}>
        <Box mb={2}>
          <Button
            variant="outlined"
            onClick={() => refetch()}
            disabled={isLoading}
          >
            Refresh
          </Button>
        </Box>
        <TemplateList
          templates={templates}
          onEdit={(template) => {
            setSelectedTemplate(template);
          }}
          onDelete={handleDelete}
          onGeneratePdf={handleGeneratePdf}
        />

        {isCreateDialogOpen && (
          <TemplateForm
            onSave={handleCreateNote}
            onClose={() => setIsCreateDialogOpen(false)}
            isPending={isPendingAddTemplates}
          />
        )}

        {selectedTemplate && (
          <TemplateForm
            initialTemplate={selectedTemplate}
            onClose={() => setSelectedTemplate(null)}
            onSave={handleUpdateNote}
            isPending={isPendingChangeTemplate}
          />
        )}
      </Container>
    </>
  );
}
