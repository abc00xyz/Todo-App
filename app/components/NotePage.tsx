import { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, File, Trash2, Loader2, Search } from "lucide-react";
import Link from "next/link";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/firebase";
import { Skeleton } from "@/components/ui/skeleton";
import { ShowNotePage } from "../show/show_page";
import EditNotePage from "../edit/edit_page";
import { toast } from "sonner";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

interface Note {
  id: string;
  title: string;
  description: string;
  marked: boolean;
  createdAt: string;
}

const NotePage = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [filteredNotes, setFilteredNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [noteToDelete, setNoteToDelete] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const handleUserAuth = async (user: any) => {
    if (user) {
      setUser(user);
      try {
        await fetch("/api/auth", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: user.uid,
            email: user.email,
          }),
        });

        const response = await fetch(`/api/notes?userId=${user.uid}`);
        if (response.ok) {
          const data = await response.json();
          setNotes(data.notes);
          setFilteredNotes(data.notes);
        } else {
          console.error("Failed to fetch notes:", response.statusText);
        }
      } catch (error) {
        console.error(
          "Error during authentication or fetching notes:",
          (error as Error).message
        );
      }
    }
    setLoading(false);
  };

  const handleMarkAsRead = async (noteId: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/update_mark/${noteId}/mark`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ marked: !currentStatus }),
      });

      if (response.ok) {
        // Update notes state directly
        setNotes((prevNotes) =>
          prevNotes.map((note) =>
            note.id === noteId ? { ...note, marked: !currentStatus } : note
          )
        );
        setFilteredNotes((prevFilteredNotes) =>
          prevFilteredNotes.map((note) =>
            note.id === noteId ? { ...note, marked: !currentStatus } : note
          )
        );
        toast("Update Successful!");
      } else {
        toast("Failed to update note");
        console.error("Failed to update note:", response.statusText);
      }
    } catch (error) {
      toast("Failed to update note");
      console.error("Error updating note:", (error as Error).message);
    }
  };

  const handleDeleteNote = async () => {
    if (!noteToDelete) return;

    setDeleteLoading(true);

    try {
      const response = await fetch(`/api/delete/${noteToDelete}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        // Update notes state directly
        setNotes((prevNotes) =>
          prevNotes.filter((note) => note.id !== noteToDelete)
        );
        setFilteredNotes((prevFilteredNotes) =>
          prevFilteredNotes.filter((note) => note.id !== noteToDelete)
        );
        toast("Delete Successful!");
      } else {
        toast("Failed to delete note");
        console.error("Failed to delete note:", response.statusText);
      }
    } catch (error) {
      toast("Failed to delete note");
      console.error("Error deleting note:", (error as Error).message);
    }

    setDeleteLoading(false);
    setNoteToDelete(null);
  };

  const handleSearch = (query: string) => {
    setSearchTerm(query);
    const lowercasedQuery = query.toLowerCase();
    setFilteredNotes(
      notes.filter(
        (note) =>
          note.title.toLowerCase().includes(lowercasedQuery) ||
          note.description.toLowerCase().includes(lowercasedQuery)
      )
    );
  };

  useEffect(() => {
    handleSearch(searchTerm);
  }, [notes, searchTerm]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      handleUserAuth(user);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const query = urlParams.get("search") || "";
    if (query) {
      handleSearch(query);
    }
  }, [notes]);

  if (editingNote) {
    return (
      <EditNotePage
        note={editingNote}
        setEditingNote={setEditingNote}
        setNotes={setNotes}
      />
    );
  }

  if (selectedNote) {
    return (
      <ShowNotePage note={selectedNote} setSelectedNote={setSelectedNote} />
    );
  }

  if (loading) {
    return (
      <div>
        <div className="pt-[15vh] flex flex-col space-y-3 items-center m-2">
          <div className="space-y-3 flex flex-col items-center">
            <Skeleton className="h-6 w-[150px]" />
            <Skeleton className="h-4 w-[300px]" />
            <Skeleton className="h-10 w-[150px] rounded-md" />
          </div>
        </div>
        <p></p>
        <div className="pt-[5vh] flex flex-wrap justify-center gap-3">
          {Array.from({ length: 15 }).map((_, index) => (
            <div
              key={index}
              className="flex flex-col space-y-3 items-center m-2"
            >
              <Skeleton className="h-[125px] w-[250px] rounded-xl" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-[250px]" />
                <Skeleton className="h-4 w-[200px]" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="pb-4 pt-[15vh]">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold">Your Notes</h1>
          <p className="mt-2 text-lg text-muted-foreground">
            Manage and create new notes here.
          </p>
          <Button asChild className="mt-4">
            <Link href="/new">Create a new Note</Link>
          </Button>
        </div>
        <div
          className={`${
            filteredNotes.length === 0 ? "-mb-[60vh]" : ""
          } flex items-center justify-center  `}
        >
          <Input
            type="text"
            placeholder="Search Notes..."
            value={searchTerm}
            onChange={(e) => {
              handleSearch(e.target.value);
              const urlParams = new URLSearchParams(window.location.search);
              urlParams.set("search", e.target.value);
              window.history.replaceState(null, "", `?${urlParams.toString()}`);
            }}
            className="w-[75vw] sm:w-full max-w-md mb-2 "
          />
        </div>
      </div>
      {filteredNotes.length === 0 ? (
        <div
          className={`flex items-center justify-center h-screen p-2 ${
            filteredNotes.length === 0 ? "pt-[13vh] sm:pt-0" : ""
          }`}
        >
          <div className="flex flex-col items-center justify-center p-6 rounded-md border border-dashed text-center">
            {searchTerm ? (
              <div className="w-[65vw] sm:w-full">
                <h2 className="text-xl font-semibold">No results found</h2>
                <p className="my-4 text-sm text-muted-foreground">
                  No notes match your search criteria. Try adjusting your search
                  terms.
                </p>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center w-full mt mx-2 bg-primary/10 rounded-lg p-6 sm:p-8 md:p-12">
                <File className="w-12 h-12 text-primary" />
                <h2 className=" text-lg sm:text-xl font-semibold text-center">
                  You don&apos;t have any notes created
                </h2>
                <p className="my-4 text-sm sm:text-base text-center text-muted-foreground">
                  You currently don&apos;t have any notes. Please create some to
                  see them here.
                </p>
                <Button asChild className="w-full mt-4">
                  <Link href="/new">Create a new Note</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="flex flex-wrap gap-4 pl-[2vh] pr-[2vh] justify-center pb-[10vh]">
          {filteredNotes.map((note) => (
            <Card
              key={note.id}
              className={`min-w-[280px] md:min-w-[350px] ${
                !note.marked ? "bg-secondary" : "none"
              } cursor-pointer`}
              onClick={() => setSelectedNote(note)}
            >
              <CardHeader className="flex flex-col">
                <div className="flex items-center justify-center mb-2 space-x-2">
                  <Button
                    variant="ghost"
                    className={
                      note.marked ? "" : "hover:border border-muted-foreground"
                    }
                    onClick={(e) => {
                      e.stopPropagation();
                      handleMarkAsRead(note.id, note.marked);
                    }}
                  >
                    {note.marked ? "Mark as Unread" : "Mark as Read"}
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditingNote(note);
                    }}
                  >
                    <Edit />
                  </Button>
                  <Button
                    variant={"ghost"}
                    className="w-0 m-0"
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                  >
                    <Dialog>
                      <DialogTrigger
                        asChild
                        onClick={(e) => {
                          e.stopPropagation();
                          setNoteToDelete(note.id);
                        }}
                      >
                        <Button
                          variant="ghost"
                          className="text-red-500 hover:text-red-500"
                        >
                          <Trash2 />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-[95vw] sm:w-[75vw] md:w-[50vw] lg:w-[40vw]">
                        <DialogHeader>
                          <DialogTitle>Are you absolutely sure?</DialogTitle>
                          <DialogDescription>
                            This action cannot be undone. This will permanently
                            delete your Notes and remove your data from our
                            servers.
                          </DialogDescription>
                        </DialogHeader>
                        <DialogFooter className="flex flex-row items-center justify-end">
                          <DialogClose>
                            <Button type="button" variant="secondary">
                              Close
                            </Button>
                          </DialogClose>
                          <Button
                            variant="destructive"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteNote();
                            }}
                            className="mx-2 flex items-center"
                            disabled={deleteLoading}
                          >
                            {deleteLoading && (
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            )}
                            {deleteLoading ? "Please wait" : "Delete"}
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </Button>
                </div>
                <hr
                  className={` ${
                    note.marked ? "" : "border-muted-foreground "
                  }`}
                />
                <CardTitle className="flex items-center space-x-2 pt-2">
                  {!note.marked && (
                    <span className="inline-block w-2 h-2 bg-blue-500 rounded-full"></span>
                  )}
                  <span className="text-sm sm:text-base overflow-hidden text-ellipsis whitespace-nowrap">
                    {note.title}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>{note.description}</CardContent>
              <CardFooter></CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default NotePage;
