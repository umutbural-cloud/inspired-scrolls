import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/context/AuthContext";
import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";
import Reading from "./pages/Reading.tsx";
import AuthorProfile from "./pages/AuthorProfile.tsx";
import Category from "./pages/Category.tsx";
import Research from "./pages/Research.tsx";
import Collective from "./pages/Collective.tsx";
import Scientific from "./pages/Scientific.tsx";
import StudyDetail from "./pages/StudyDetail.tsx";
import Search from "./pages/Search.tsx";
import SignIn from "./pages/SignIn.tsx";
import SignUp from "./pages/SignUp.tsx";
import Overview from "./pages/profile/Overview.tsx";
import Recovery from "./pages/profile/Recovery.tsx";
import Lists from "./pages/profile/Lists.tsx";
import ListDetail from "./pages/profile/ListDetail.tsx";
import Completed from "./pages/profile/Completed.tsx";
import CompletedDetail from "./pages/profile/CompletedDetail.tsx";
import Notes from "./pages/profile/Notes.tsx";
import Following from "./pages/profile/Following.tsx";
import Settings from "./pages/profile/Settings.tsx";
import NotificationSettings from "./pages/profile/NotificationSettings.tsx";
import ContentPreferences from "./pages/profile/ContentPreferences.tsx";
import EditorPage from "./pages/profile/Editor.tsx";
import Drafts from "./pages/profile/Drafts.tsx";
import Posts from "./pages/profile/Posts.tsx";
import RevisionPage from "./pages/profile/Revision.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/yazi/:slug" element={<Reading />} />
            <Route path="/yazar/:slug" element={<AuthorProfile />} />
            <Route path="/kategori/:slug" element={<Category />} />
            <Route path="/etiket/:slug" element={<Category />} />
            <Route path="/arastirmalar" element={<Research />} />
            <Route path="/kolektif" element={<Collective />} />
            <Route path="/bilimsel" element={<Scientific />} />
            <Route path="/bilimsel/:slug" element={<StudyDetail />} />
            <Route path="/ara" element={<Search />} />
            <Route path="/giris" element={<SignIn />} />
            <Route path="/kayit" element={<SignUp />} />
            <Route path="/profil" element={<Overview />} />
            <Route path="/profil/surecim" element={<Recovery />} />
            <Route path="/profil/listeler" element={<Lists />} />
            <Route path="/profil/listeler/:id" element={<ListDetail />} />
            <Route path="/profil/tamamlanan" element={<Completed />} />
            <Route path="/profil/tamamlanan/:slug" element={<CompletedDetail />} />
            <Route path="/profil/notlarim" element={<Notes />} />
            <Route path="/profil/takip" element={<Following />} />
            <Route path="/profil/ayarlar" element={<Settings />} />
            <Route path="/profil/ayarlar/bildirim" element={<NotificationSettings />} />
            <Route path="/profil/ayarlar/icerik" element={<ContentPreferences />} />
            <Route path="/profil/yaz/:id" element={<EditorPage />} />
            <Route path="/profil/taslaklar" element={<Drafts />} />
            <Route path="/profil/yazilar" element={<Posts />} />
            <Route path="/profil/revize/:id" element={<RevisionPage />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
