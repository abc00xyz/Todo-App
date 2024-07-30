"use client";
import { FC, useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface Note {
  id: string;
  title: string;
  description: string;
  marked: boolean;
  createdAt: string;
}

interface EditNotePageProps {
  note: Note;
  setEditingNote: (note: Note | null) => void;
  setNotes: React.Dispatch<React.SetStateAction<Note[]>>;
}

const EditNotePage: FC<EditNotePageProps> = ({
  note,
  setEditingNote,
  setNotes,
}) => {
  const [title, setTitle] = useState(note.title);
  const [description, setDescription] = useState(note.description);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleUpdateNote = async () => {
    setIsUpdating(true);
    try {
      const response = await fetch(`/api/update/${note.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, description }),
      });

      if (response.ok) {
        const updatedNote = await response.json();
        const updatedNoteData: Note = updatedNote.note;

        setNotes((prevNotes) =>
          prevNotes.map((n) => (n.id === note.id ? updatedNoteData : n))
        );
        setEditingNote(null);
        toast("Update Successful!");
      } else {
        toast("Failed to update note");
        console.error("Failed to update note:", response.statusText);
      }
    } catch (error) {
      toast("Failed to update note");
      console.error("Error updating note:", (error as Error).message);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-6">
      <Card className="min-w-[50vw] min-h-[50vh] p-4 shadow-lg rounded-lg">
        <Button
          variant="ghost"
          className="hover:bg-transparent ml-1"
          onClick={() => setEditingNote(null)}
        >
          <ArrowLeft /> Back
        </Button>
        <CardHeader>
          <CardTitle>Edit Note</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Title
              </label>
              <Input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="mt-1 block w-full"
                disabled={isUpdating}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="mt-1 block w-full"
                disabled={isUpdating}
              />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex space-x-4 -mb-4">
          <Button
            variant="secondary"
            onClick={() => setEditingNote(null)}
            className="flex"
            disabled={isUpdating}
          >
            Close
          </Button>
          <Button
            onClick={handleUpdateNote}
            className="flex"
            disabled={isUpdating}
          >
            {isUpdating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please wait
              </>
            ) : (
              "Update"
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default EditNotePage;
