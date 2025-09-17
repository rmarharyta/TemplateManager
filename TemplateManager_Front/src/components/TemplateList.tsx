import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  IconButton,
  Paper,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import DeleteIcon from "@mui/icons-material/Delete";
import { Template } from "../utils/api/templatesServices";

interface Props {
  templates: Template[];
  onEdit?: (template: Template) => void;
  onDelete?: (id: string) => void;
  onGeneratePdf?: (id: string) => void;
}

export default function TemplateList({
  templates,
  onEdit,
  onDelete,
  onGeneratePdf,
}: Props) {
  return (
    <Paper sx={{ width: "100%", overflow: "hidden" }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {templates.map((template) => (
            <TableRow key={template.id}>
              <TableCell>{template.name}</TableCell>

              <TableCell align="right">
                <IconButton onClick={() => onEdit?.(template)}>
                  <EditIcon />
                </IconButton>
                <IconButton onClick={() => onGeneratePdf?.(template.id)}>
                  <PictureAsPdfIcon />
                </IconButton>
                <IconButton onClick={() => onDelete?.(template.id)}>
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
}
