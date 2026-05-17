CREATE TABLE public.tasks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  subject TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read tasks" ON public.tasks FOR SELECT USING (true);
CREATE POLICY "Public can insert tasks" ON public.tasks FOR INSERT WITH CHECK (true);
CREATE POLICY "Public can delete tasks" ON public.tasks FOR DELETE USING (true);

ALTER PUBLICATION supabase_realtime ADD TABLE public.tasks;
ALTER TABLE public.tasks REPLICA IDENTITY FULL;