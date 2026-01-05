import React, { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Plus as AddIcon,
  Edit as EditIcon,
  Trash2 as DeleteIcon,
  Eye as ViewIcon,
  Upload as UploadIcon,
  Download as DownloadIcon,
  Search as SearchIcon,
  RefreshCw as RefreshIcon,
  MoreHorizontal as MoreIcon,
} from "lucide-react";

import { useQuizzes, useQuizActions } from "../hooks/useQuiz";
import {
  Quiz,
  QuizLevel,
  CreateQuizRequest,
  UpdateQuizRequest,
  Language,
} from "../api/types";

const QUIZ_LEVELS: QuizLevel[] = ["A1", "A2", "B1", "B2", "C1", "C2"];

interface QuizManagementProps {
  languages?: Language[];
}

export const QuizManagement: React.FC<QuizManagementProps> = ({
  languages = [],
}) => {
  // State for filters
  const [filters, setFilters] = useState({
    search: "",
    language_id: undefined as number | undefined,
    level: undefined as QuizLevel | undefined,
    is_active: undefined as boolean | undefined,
  });

  // State for dialogs
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);
  const [importDialogOpen, setImportDialogOpen] = useState(false);

  // Use the updated hooks
  const {
    data: quizzes,
    loading,
    error,
    refetch: refreshQuizzes,
  } = useQuizzes(filters);
  const {
    loading: operationLoading,
    error: operationError,
    createQuiz,
    updateQuiz,
    deleteQuiz,
    importQuizzes,
    exportToCSV,
  } = useQuizActions();

  // Handle filter changes
  const handleFilterChange = useCallback((key: string, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }, []);

  // Handle create quiz
  const handleCreateQuiz = useCallback(
    async (data: CreateQuizRequest) => {
      try {
        await createQuiz(data);
        setCreateDialogOpen(false);
        refreshQuizzes();
      } catch (error) {
        console.error("Failed to create quiz:", error);
      }
    },
    [createQuiz, refreshQuizzes]
  );

  // Handle update quiz
  const handleUpdateQuiz = useCallback(
    async (id: number, data: UpdateQuizRequest) => {
      try {
        await updateQuiz(id, data);
        setEditDialogOpen(false);
        setSelectedQuiz(null);
        refreshQuizzes();
      } catch (error) {
        console.error("Failed to update quiz:", error);
      }
    },
    [updateQuiz, refreshQuizzes]
  );

  // Handle delete quiz
  const handleDeleteQuiz = useCallback(
    async (id: number) => {
      if (window.confirm("Are you sure you want to delete this quiz?")) {
        try {
          await deleteQuiz(id);
          refreshQuizzes();
        } catch (error) {
          console.error("Failed to delete quiz:", error);
        }
      }
    },
    [deleteQuiz, refreshQuizzes]
  );

  // Handle import
  const handleImport = useCallback(
    async (file: File) => {
      try {
        const result = await importQuizzes(file);
        setImportDialogOpen(false);
        refreshQuizzes();
        alert(`Successfully imported ${result.created_quizzes} quizzes`);
      } catch (error) {
        console.error("Failed to import quizzes:", error);
      }
    },
    [importQuizzes, refreshQuizzes]
  );

  // Handle export
  const handleExport = useCallback(async () => {
    try {
      const blob = await exportToCSV(filters);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "quizzes.csv";
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Failed to export quizzes:", error);
    }
  }, [exportToCSV, filters]);

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Quiz Management</h1>
      </div>

      {/* Error Display */}
      {(error || operationError) && (
        <Alert variant="destructive">
          <AlertDescription>
            {error?.message || operationError?.message || "An error occurred"}
          </AlertDescription>
        </Alert>
      )}

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        <div className="flex-1 relative">
          <SearchIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search quizzes..."
            value={filters.search}
            onChange={(e) => handleFilterChange("search", e.target.value)}
            className="pl-10"
          />
        </div>

        <Select
          value={filters.language_id?.toString() || "all"}
          onValueChange={(value) =>
            handleFilterChange(
              "language_id",
              value === "all" ? undefined : Number(value)
            )
          }
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="All Languages" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Languages</SelectItem>
            {languages.map((lang) => (
              <SelectItem key={lang.id} value={lang.id.toString()}>
                {lang.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={filters.level || "all"}
          onValueChange={(value) =>
            handleFilterChange("level", value === "all" ? undefined : value)
          }
        >
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="All Levels" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Levels</SelectItem>
            {QUIZ_LEVELS.map((level) => (
              <SelectItem key={level} value={level}>
                {level}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={
            filters.is_active === undefined
              ? "all"
              : filters.is_active.toString()
          }
          onValueChange={(value) =>
            handleFilterChange(
              "is_active",
              value === "all" ? undefined : value === "true"
            )
          }
        >
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="true">Active</SelectItem>
            <SelectItem value="false">Inactive</SelectItem>
          </SelectContent>
        </Select>

        <div className="flex gap-2">
          <Button onClick={() => setCreateDialogOpen(true)}>
            <AddIcon className="h-4 w-4 mr-2" />
            Add Quiz
          </Button>

          <Button variant="outline" onClick={() => setImportDialogOpen(true)}>
            <UploadIcon className="h-4 w-4 mr-2" />
            Import
          </Button>

          <Button
            variant="outline"
            onClick={handleExport}
            disabled={loading || operationLoading}
          >
            <DownloadIcon className="h-4 w-4 mr-2" />
            Export
          </Button>

          <Button
            variant="outline"
            size="icon"
            onClick={refreshQuizzes}
            disabled={loading}
          >
            <RefreshIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Loading Indicator */}
      {(loading || operationLoading) && <Progress className="w-full" />}

      {/* Quiz Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {quizzes?.map((quiz) => (
          <Card key={quiz.id} className="relative">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <CardTitle className="text-lg line-clamp-2">
                  {quiz.title.en}
                </CardTitle>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreIcon className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() => {
                        setSelectedQuiz(quiz);
                        setEditDialogOpen(true);
                      }}
                    >
                      <EditIcon className="h-4 w-4 mr-2" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-destructive"
                      onClick={() => handleDeleteQuiz(quiz.id)}
                    >
                      <DeleteIcon className="h-4 w-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <ViewIcon className="h-4 w-4 mr-2" />
                      View
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                {quiz.description?.en}
              </p>
              <div className="flex flex-wrap gap-2 mb-3">
                <Badge variant="secondary">{quiz.level}</Badge>
                <Badge variant="outline">
                  {quiz.language?.name || "No Language"}
                </Badge>
                <Badge variant={quiz.is_active ? "default" : "secondary"}>
                  {quiz.is_active ? "Active" : "Inactive"}
                </Badge>
              </div>
              <div className="text-sm text-muted-foreground space-y-1">
                <div>
                  Questions: {quiz.questions_count} | Attempts:{" "}
                  {quiz.attempts_count}
                </div>
                <div>Duration: {quiz.duration_minutes || "N/A"} minutes</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* No Data State */}
      {!loading && (!quizzes || quizzes.length === 0) && (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-muted-foreground mb-2">
            No quizzes found
          </h3>
          <p className="text-sm text-muted-foreground">
            Try adjusting your filters or create a new quiz
          </p>
        </div>
      )}

      {/* Create/Edit Dialog */}
      <Dialog
        open={createDialogOpen || editDialogOpen}
        onOpenChange={(open) => {
          if (!open) {
            setCreateDialogOpen(false);
            setEditDialogOpen(false);
            setSelectedQuiz(null);
          }
        }}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {selectedQuiz ? "Edit Quiz" : "Create New Quiz"}
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-muted-foreground">
              Quiz form would go here. This is a placeholder for the form.
            </p>
          </div>
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setCreateDialogOpen(false);
                setEditDialogOpen(false);
                setSelectedQuiz(null);
              }}
            >
              Cancel
            </Button>
            <Button>{selectedQuiz ? "Update" : "Create"}</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Import Dialog */}
      <Dialog open={importDialogOpen} onOpenChange={setImportDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Import Quizzes</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-muted-foreground">
              Import functionality would go here. This is a placeholder.
            </p>
          </div>
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setImportDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button>Import</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default QuizManagement;
