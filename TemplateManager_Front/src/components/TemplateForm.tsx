import React, { useState, useEffect } from "react";
import {
  Paper,
  Typography,
  TextField,
  Box,
  Button,
  DialogTitle,
  Dialog,
  DialogContent,
} from "@mui/material";
import { Template } from "../utils/api/templatesServices";

interface Props {
  initialTemplate?: Template;
  userId?: string;
  onClose: () => void;
  onSave: (initialTemplate: Template) => void;
  isPending: boolean;
}

const TemplateForm: React.FC<Props> = ({
  initialTemplate,
  userId,
  onClose,
  onSave,
  isPending = false,
}) => {
  const [name, setName] = useState(initialTemplate?.name || "");
  const [html, setHtml] = useState(initialTemplate?.html || "");

  // Оновлюємо поля при зміні initialTemplate
  useEffect(() => {
    if (initialTemplate) {
      setName(initialTemplate?.name);
      setHtml(initialTemplate?.html);
    }
  }, [initialTemplate]);

  const handleSave = () => {
    if (initialTemplate) {
      // Update existing template
      onSave({
        ...initialTemplate,
        name: name,
        html: html,
      });
    } else {
      onSave({
        id: "",
        name: name,
        html: html,
        userId: userId as string,
      });
    }
  };
  return (
    <Dialog open={true} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{initialTemplate ? "Update" : "Create"}</DialogTitle>
      <DialogContent>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
          <TextField
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
            sx={{ mb: 2 }}
            error={!name.trim() && name !== ""}
            helperText={!name.trim() && name !== "" ? "Name is required" : ""}
          />
          <TextField
            label="HTML"
            value={html}
            onChange={(e) => setHtml(e.target.value)}
            fullWidth
            multiline
            rows={6}
            sx={{ mb: 2 }}
            error={!html.trim() && html !== ""}
            helperText={
              !html.trim() && html !== "" ? "HTML content is required" : ""
            }
          />
          <Box display="flex" gap={2}>
            <Button
              variant="contained"
              onClick={handleSave}
              disabled={isPending || !name.trim() || !html.trim()}
              sx={{
                backgroundColor: "#08031B",
                color: "#FFFFFF",
              }}
            >
              {isPending ? "Saving..." : "Save"}
            </Button>
            <Button
              variant="outlined"
              onClick={onClose}
              disabled={isPending}
              sx={{ color: "#08031B", borderColor: "#08031B" }}
            >
              Cancel
            </Button>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default TemplateForm;
