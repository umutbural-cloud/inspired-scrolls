
CREATE TABLE public.recovery_profiles (
  user_id uuid NOT NULL PRIMARY KEY,
  start_date timestamp with time zone NOT NULL DEFAULT now(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.recovery_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users read own recovery profile"
  ON public.recovery_profiles FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users insert own recovery profile"
  ON public.recovery_profiles FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users update own recovery profile"
  ON public.recovery_profiles FOR UPDATE TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users delete own recovery profile"
  ON public.recovery_profiles FOR DELETE TO authenticated
  USING (auth.uid() = user_id);

CREATE TRIGGER trg_recovery_profiles_updated_at
  BEFORE UPDATE ON public.recovery_profiles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.relapses (
  id uuid NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  occurred_at timestamp with time zone NOT NULL DEFAULT now(),
  note text,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

CREATE INDEX idx_relapses_user_time ON public.relapses(user_id, occurred_at DESC);

ALTER TABLE public.relapses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users read own relapses"
  ON public.relapses FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users insert own relapses"
  ON public.relapses FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users delete own relapses"
  ON public.relapses FOR DELETE TO authenticated
  USING (auth.uid() = user_id);
