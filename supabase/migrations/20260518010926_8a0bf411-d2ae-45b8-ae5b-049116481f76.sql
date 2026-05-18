CREATE TABLE public.todos (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    subject TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.todos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read todos"
ON public.todos
FOR SELECT
TO public
USING (true);

CREATE POLICY "Public can insert todos"
ON public.todos
FOR INSERT
TO public
WITH CHECK (true);

CREATE POLICY "Public can delete todos"
ON public.todos
FOR DELETE
TO public
USING (true);

ALTER PUBLICATION supabase_realtime ADD TABLE public.todos;