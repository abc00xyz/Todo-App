import { FC } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface Note {
  id: string;
  title: string;
  description: string;
  marked: boolean;
  createdAt: string;
}

interface ShowNotePageProps {
  note: Note | null;
  setSelectedNote: (note: Note | null) => void;
}

export const ShowNotePage: FC<ShowNotePageProps> = ({
  note,
  setSelectedNote,
}) => {
  if (!note) {
    return (
      <div className="flex items-center justify-center h-screen p-2">
        <Card className="min-w-[50vw] max-w-md p-4 min-h-[50vh]">
          <Button
            variant={"ghost"}
            className="hover:bg-transparent"
            onClick={() => setSelectedNote(null)}
          >
            <ArrowLeft /> Back
          </Button>
          <CardHeader>
            <CardTitle className="text-2xl font-bold">
              No Note Selected
            </CardTitle>
          </CardHeader>
          <CardContent className="mt-4 h-[30vh] overflow-auto">
            <p>Please select a note to view its details.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const date = new Date(note.createdAt);

  const formattedDate = new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    hour12: true,
  }).format(date);

  return (
    <div className="flex items-center justify-center h-screen p-2">
      <Card className="min-w-[50vw] max-w-md p-4 min-h-[50vh]">
        <Button
          variant={"ghost"}
          className="hover:bg-transparent"
          onClick={() => setSelectedNote(null)}
        >
          <ArrowLeft /> Back
        </Button>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">{note.title}</CardTitle>
          <p className="text-sm text-muted-foreground">
            Last modified: {formattedDate}
          </p>
        </CardHeader>
        <hr />
        <CardContent className="mt-4 h-[30vh] overflow-auto">
          {/* Render description with new line support and scrolling */}
          <pre className="whitespace-pre-line">{note.description}</pre>
        </CardContent>
      </Card>
    </div>
  );
};
