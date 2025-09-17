import React, { useEffect, useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Container,
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import LogoutIcon from "@mui/icons-material/Logout";
import AddIcon from "@mui/icons-material/Add";
import { Template } from "../utils/api/templatesServices";
import TemplateList from "../components/TemplateList";
import TemplateForm from "../components/TemplateForm";
import {
  useAddTemplate,
  useDeleteTemplate,
  useTemplates,
  useUpdateTemplate,
} from "../utils/api/useTemplateMutation";
import { useLogout } from "../utils/api/useUserMutation";
import PdfGenerator from "../components/PdfGenerator";

export default function Home() {
  const navigate = useNavigate();
  const { mutate: mutateExit } = useLogout();

  const [templates, setTemplates] = useState<Template[]>([]);

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState<boolean>(false);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(
    null
  );
  const [pdfTemplate, setPdfTemplate] = useState<Template | null>(null); // для PDF модалки

  const { mutateAsync: deleteTemplateMutate } = useDeleteTemplate();
  const { mutateAsync: addTemplateMutate, isPending: isPendingAddTemplates } =
    useAddTemplate();

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
    //швидке оновлення списку
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

  return (
    <>
      <Box sx={{ flexGrow: 1, backgroundColor: "#F8F6F0", minHeight: "100vh" }}>
        <AppBar position="static" sx={{ backgroundColor: "#08031B" }}>
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
              sx={{
                color: "#08031B",
                borderColor: "#08031B",
              }}
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
            onGeneratePdf={(id) => {
              const template = templates.find((t) => t.id === id);
              if (template) setPdfTemplate(template);
            }}
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

          {/* Модалка для генерації PDF */}
          <Dialog
            open={pdfTemplate !== null}
            onClose={() => setPdfTemplate(null)}
            maxWidth="sm"
            fullWidth
          >
            <DialogTitle>Генерація PDF</DialogTitle>
            <DialogContent>
              {pdfTemplate && (
                <PdfGenerator
                  template={pdfTemplate}
                  onClose={() => setPdfTemplate(null)}
                />
              )}
            </DialogContent>
          </Dialog>
        </Container>
      </Box>
    </>
  );
}
