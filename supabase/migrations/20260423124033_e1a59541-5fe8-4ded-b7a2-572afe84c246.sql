-- 1. ROLES
CREATE TYPE public.app_role AS ENUM ('admin', 'editor', 'writer', 'user');

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

CREATE POLICY "Users read own roles"
ON public.user_roles FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Admins read all roles"
ON public.user_roles FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins manage roles"
ON public.user_roles FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- 2. POSTS
CREATE TYPE public.post_status AS ENUM ('draft', 'in_review', 'changes_requested', 'approved', 'published', 'rejected');

CREATE TABLE public.posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL DEFAULT '',
  slug TEXT UNIQUE,
  excerpt TEXT,
  content JSONB NOT NULL DEFAULT '{}'::jsonb,
  content_text TEXT NOT NULL DEFAULT '',
  cover_image_url TEXT,
  category_slug TEXT,
  tags TEXT[] NOT NULL DEFAULT '{}',
  meta_title TEXT,
  meta_description TEXT,
  og_image_url TEXT,
  status post_status NOT NULL DEFAULT 'draft',
  read_minutes INT NOT NULL DEFAULT 0,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_posts_author ON public.posts(author_id);
CREATE INDEX idx_posts_status ON public.posts(status);
CREATE INDEX idx_posts_published_at ON public.posts(published_at DESC);

ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone reads published posts"
ON public.posts FOR SELECT
USING (status = 'published');

CREATE POLICY "Authors read own posts"
ON public.posts FOR SELECT
TO authenticated
USING (auth.uid() = author_id);

CREATE POLICY "Editors read all posts"
ON public.posts FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'editor') OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Authors insert own posts"
ON public.posts FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Authors update own posts"
ON public.posts FOR UPDATE
TO authenticated
USING (auth.uid() = author_id)
WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Editors update any post"
ON public.posts FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'editor') OR public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'editor') OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Authors delete own drafts"
ON public.posts FOR DELETE
TO authenticated
USING (auth.uid() = author_id AND status IN ('draft', 'changes_requested', 'rejected'));

CREATE POLICY "Admins delete posts"
ON public.posts FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER trg_posts_updated_at
BEFORE UPDATE ON public.posts
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- 3. REVISIONS (editor önerileri, önce/sonra diff)
CREATE TYPE public.revision_status AS ENUM ('pending', 'accepted', 'rejected');

CREATE TABLE public.post_revisions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
  editor_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  before_content JSONB NOT NULL,
  after_content JSONB NOT NULL,
  before_text TEXT NOT NULL DEFAULT '',
  after_text TEXT NOT NULL DEFAULT '',
  note TEXT,
  status revision_status NOT NULL DEFAULT 'pending',
  resolved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_revisions_post ON public.post_revisions(post_id);

ALTER TABLE public.post_revisions ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.is_post_participant(_post_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.posts p
    WHERE p.id = _post_id
      AND (
        p.author_id = auth.uid()
        OR public.has_role(auth.uid(), 'editor')
        OR public.has_role(auth.uid(), 'admin')
      )
  )
$$;

CREATE POLICY "Participants read revisions"
ON public.post_revisions FOR SELECT
TO authenticated
USING (public.is_post_participant(post_id));

CREATE POLICY "Editors create revisions"
ON public.post_revisions FOR INSERT
TO authenticated
WITH CHECK (
  (public.has_role(auth.uid(), 'editor') OR public.has_role(auth.uid(), 'admin'))
  AND auth.uid() = editor_id
);

CREATE POLICY "Author updates revision status"
ON public.post_revisions FOR UPDATE
TO authenticated
USING (
  EXISTS (SELECT 1 FROM public.posts p WHERE p.id = post_id AND p.author_id = auth.uid())
  OR public.has_role(auth.uid(), 'admin')
)
WITH CHECK (
  EXISTS (SELECT 1 FROM public.posts p WHERE p.id = post_id AND p.author_id = auth.uid())
  OR public.has_role(auth.uid(), 'admin')
);

-- 4. COMMENTS (editor ↔ yazar mesajlaşması)
CREATE TABLE public.post_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  body TEXT NOT NULL,
  block_anchor TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_comments_post ON public.post_comments(post_id, created_at);

ALTER TABLE public.post_comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Participants read comments"
ON public.post_comments FOR SELECT
TO authenticated
USING (public.is_post_participant(post_id));

CREATE POLICY "Participants insert comments"
ON public.post_comments FOR INSERT
TO authenticated
WITH CHECK (
  public.is_post_participant(post_id) AND auth.uid() = author_id
);

CREATE POLICY "Authors delete own comments"
ON public.post_comments FOR DELETE
TO authenticated
USING (auth.uid() = author_id);

-- 5. handle_new_user güncelle: yeni kullanıcıya 'user' ve 'writer' rolü ver
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'display_name', split_part(NEW.email, '@', 1))
  );

  INSERT INTO public.notification_preferences (user_id) VALUES (NEW.id);

  INSERT INTO public.reading_lists (user_id, name, is_default)
  VALUES (NEW.id, 'Kaydettiklerim', true);

  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'user');
  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'writer');

  RETURN NEW;
END;
$$;

-- 6. STORAGE bucket: post-images
INSERT INTO storage.buckets (id, name, public)
VALUES ('post-images', 'post-images', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Post images are public"
ON storage.objects FOR SELECT
USING (bucket_id = 'post-images');

CREATE POLICY "Authenticated upload post images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'post-images' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users update own post images"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'post-images' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users delete own post images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'post-images' AND auth.uid()::text = (storage.foldername(name))[1]);