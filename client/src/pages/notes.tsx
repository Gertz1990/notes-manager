import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { insertNoteSchema, type Note, type InsertNote } from "@shared/schema";
import { Loader2, Pencil, Trash, LogOut } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { useAuth } from "@/hooks/use-auth";

export default function Notes() {
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const { toast } = useToast();
  const { logoutMutation } = useAuth();

  const { data: notes, isLoading } = useQuery<Note[]>({
    queryKey: ["/api/notes"],
  });

  const createNoteMutation = useMutation({
    mutationFn: async (data: InsertNote) => {
      const res = await apiRequest("POST", "/api/notes", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/notes"] });
      toast({
        title: "Заметка создана",
        description: "Ваша заметка была успешно создана",
      });
    },
  });

  const updateNoteMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<InsertNote> }) => {
      const res = await apiRequest("PUT", `/api/notes/${id}`, data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/notes"] });
      setEditingNote(null);
      toast({
        title: "Заметка обновлена",
        description: "Ваша заметка была успешно обновлена",
      });
    },
  });

  const deleteNoteMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/notes/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/notes"] });
      toast({
        title: "Заметка удалена",
        description: "Ваша заметка была успешно удалена",
      });
    },
  });

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">Мои заметки</h1>
          <Button 
            variant="outline" 
            onClick={() => logoutMutation.mutate()} 
            disabled={logoutMutation.isPending}
          >
            {logoutMutation.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <LogOut className="h-4 w-4 mr-2" />
            )}
            Выйти
          </Button>
        </div>

        <div className="grid gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Новая заметка</CardTitle>
              <CardDescription>Создайте новую заметку</CardDescription>
            </CardHeader>
            <CardContent>
              <NoteForm onSubmit={(data) => createNoteMutation.mutate(data)} />
            </CardContent>
          </Card>

          {isLoading ? (
            <div className="flex justify-center p-8">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : notes?.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center text-muted-foreground">
                У вас пока нет заметок. Создайте свою первую заметку!
              </CardContent>
            </Card>
          ) : (
            notes?.map((note) => (
              <Card key={note.id}>
                {editingNote?.id === note.id ? (
                  <CardContent className="pt-6">
                    <NoteForm
                      defaultValues={note}
                      onSubmit={(data) =>
                        updateNoteMutation.mutate({ id: note.id, data })
                      }
                      onCancel={() => setEditingNote(null)}
                    />
                  </CardContent>
                ) : (
                  <>
                    <CardHeader>
                      <CardTitle>{note.title}</CardTitle>
                      <CardDescription>
                        Создано: {format(new Date(note.createdAt), "dd.MM.yyyy HH:mm")}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="whitespace-pre-wrap">{note.content}</p>
                    </CardContent>
                    <CardFooter className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setEditingNote(note)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() => deleteNoteMutation.mutate(note.id)}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </CardFooter>
                  </>
                )}
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

function NoteForm({
  defaultValues,
  onSubmit,
  onCancel,
}: {
  defaultValues?: Note;
  onSubmit: (data: InsertNote) => void;
  onCancel?: () => void;
}) {
  const form = useForm<InsertNote>({
    resolver: zodResolver(insertNoteSchema),
    defaultValues: defaultValues ?? {
      title: "",
      content: "",
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Заголовок</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Содержание</FormLabel>
              <FormControl>
                <Textarea rows={5} {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <div className="flex justify-end gap-2">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Отмена
            </Button>
          )}
          <Button type="submit">
            {defaultValues ? "Сохранить" : "Создать"}
          </Button>
        </div>
      </form>
    </Form>
  );
}