import React, { useState, useEffect } from "react";
import { Button, TextField, Box } from "@mui/material";
import { Template } from "../utils/api/templatesServices";
import { generatePdf } from "../utils/api/templatesServices";

interface PdfGeneratorProps {
  template: Template;
  onClose: () => void;
}

const PdfGenerator: React.FC<PdfGeneratorProps> = ({ template, onClose }) => {
  const [placeholders, setPlaceholders] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Ініціалізація placeholders
  useEffect(() => {
    const keys = Array.from(template.html.matchAll(/{{(.*?)}}/g)).map(
      (m) => m[1]
    );
    const initValues: Record<string, string> = {};
    keys.forEach((key) => (initValues[key] = ""));
    setPlaceholders(initValues);
  }, [template]);

  const handleChange = (key: string, value: string) => {
    setPlaceholders((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    // перевірка на пусті значення
    for (const key in placeholders) {
      if (!placeholders[key]) {
        alert(`field ${key} cannot be empty`);
        return;
      }
    }

    setIsSubmitting(true);
    try {
      const blob = await generatePdf(template.id, placeholders);
      const url = window.URL.createObjectURL(blob);
      window.open(url, "_blank");

      const a = document.createElement("a");
      a.href = url;
      a.download = `${template.name}.pdf`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error to generate PDF:", error);
    } finally {
      setIsSubmitting(false);
      onClose();
    }
  };

  return (
    <Box>
      {Object.keys(placeholders).map((key) => (
        <TextField
          key={key}
          label={key}
          value={placeholders[key]}
          onChange={(e) => handleChange(key, e.target.value)}
          fullWidth
          margin="normal"
        />
      ))}
      <Button
        onClick={handleSubmit}
        disabled={isSubmitting}
        variant="contained"
        color="primary"
        sx={{
          backgroundColor: "#08031B",
          color: "#FFFFFF",
        }}
      >
        Generate PDF
      </Button>
      <Button
        onClick={onClose}
        variant="outlined"
        sx={{ ml: 2, color: "#08031B", borderColor: "#08031B" }}
      >
        Cancel
      </Button>
    </Box>
  );
};

export default PdfGenerator;
