import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Trash2, BookOpen, Plus, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";

export const Route = createFileRoute("/")({
  component: Index,
});

type Task = {
  id: string;
  title: string;
  subject: string;
  created_at: string;
};

const SUBJECTS = [
  "Matemática",
  "Português",
  "História",
  "Geografia",
  "Física",
  "Química",
  "Biologia",
  "Inglês",
  "Filosofia",
  "Sociologia",
] as const;

const SUBJECT_COLORS: Record<string, string> = {
  Matemática: "bg-blue-100 text-blue-800 hover:bg-blue-100",
  Português: "bg-rose-100 text-rose-800 hover:bg-rose-100",
  História: "bg-amber-100 text-amber-800 hover:bg-amber-100",
  Geografia: "bg-emerald-100 text-emerald-800 hover:bg-emerald-100",
  Física: "bg-indigo-100 text-indigo-800 hover:bg-indigo-100",
  Química: "bg-fuchsia-100 text-fuchsia-800 hover:bg-fuchsia-100",
  Biologia: "bg-green-100 text-green-800 hover:bg-green-100",
  Inglês: "bg-cyan-100 text-cyan-800 hover:bg-cyan-100",
  Filosofia: "bg-purple-100 text-purple-800 hover:bg-purple-100",
  Sociologia: "bg-orange-100 text-orange-800 hover:bg-orange-100",
};

function Index() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState<string>(SUBJECTS[0]);
  const [filter, setFilter] = useState<string>("all");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const load = async () => {
      const { data, error } = await supabase
        .from("tasks")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) {
        toast.error("Erro ao carregar tarefas");
      } else {
        setTasks((data ?? []) as Task[]);
      }
      setLoading(false);
    };
    load();

    const channel = supabase
      .channel("tasks-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "tasks" },
        (payload) => {
          if (payload.eventType === "INSERT") {
            setTasks((prev) => {
              const t = payload.new as Task;
              if (prev.some((p) => p.id === t.id)) return prev;
              return [t, ...prev];
            });
          } else if (payload.eventType === "DELETE") {
            setTasks((prev) => prev.filter((t) => t.id !== (payload.old as Task).id));
          }
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const filtered = useMemo(
    () => (filter === "all" ? tasks : tasks.filter((t) => t.subject === filter)),
    [tasks, filter],
  );

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    setSubmitting(true);
    const { error } = await supabase
      .from("tasks")
      .insert({ title: title.trim(), subject });
    if (error) {
      toast.error("Erro ao adicionar tarefa");
    } else {
      setTitle("");
      toast.success("Tarefa adicionada");
    }
    setSubmitting(false);
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("tasks").delete().eq("id", id);
    if (error) toast.error("Erro ao excluir");
    else toast.success("Tarefa removida");
  };

  const subjectsInUse = useMemo(
    () => Array.from(new Set(tasks.map((t) => t.subject))),
    [tasks],
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="mx-auto max-w-3xl px-4 py-10">
        <header className="mb-8 flex items-center gap-3">
          <div className="rounded-xl bg-primary p-2.5 text-primary-foreground">
            <BookOpen className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Tarefas de Estudo</h1>
            <p className="text-sm text-muted-foreground">
              Organize suas tarefas por matéria
            </p>
          </div>
        </header>

        <Card className="mb-6 p-5">
          <form onSubmit={handleAdd} className="flex flex-col gap-3 sm:flex-row">
            <Input
              placeholder="Nova tarefa..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="flex-1"
            />
            <Select value={subject} onValueChange={setSubject}>
              <SelectTrigger className="sm:w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SUBJECTS.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button type="submit" disabled={submitting || !title.trim()}>
              {submitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Plus className="h-4 w-4" />
              )}
              Adicionar
            </Button>
          </form>
        </Card>

        <div className="mb-4 flex flex-wrap gap-2">
          <Button
            size="sm"
            variant={filter === "all" ? "default" : "outline"}
            onClick={() => setFilter("all")}
          >
            Todas ({tasks.length})
          </Button>
          {subjectsInUse.map((s) => (
            <Button
              key={s}
              size="sm"
              variant={filter === s ? "default" : "outline"}
              onClick={() => setFilter(s)}
            >
              {s} ({tasks.filter((t) => t.subject === s).length})
            </Button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : filtered.length === 0 ? (
          <Card className="p-12 text-center text-muted-foreground">
            <BookOpen className="mx-auto mb-3 h-10 w-10 opacity-40" />
            <p>Nenhuma tarefa por aqui ainda.</p>
          </Card>
        ) : (
          <ul className="space-y-2">
            {filtered.map((task) => (
              <li key={task.id}>
                <Card className="flex items-center gap-3 p-4 transition-shadow hover:shadow-md">
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium">{task.title}</p>
                  </div>
                  <Badge
                    variant="secondary"
                    className={SUBJECT_COLORS[task.subject] ?? ""}
                  >
                    {task.subject}
                  </Badge>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => handleDelete(task.id)}
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </Card>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
