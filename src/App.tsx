import { useState, useEffect, useRef, type ReactNode, type FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, 
  Gamepad2, 
  AlertCircle, 
  X, 
  ShieldCheck, 
  ChevronRight, 
  Laptop, 
  Smartphone,
  Maximize,
  Minimize
} from 'lucide-react';
import { Game } from './types';

export default function App() {
  const [games, setGames] = useState<Game[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState<{ open: boolean; gameId: string | null }>({ open: false, gameId: null });
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);

  useEffect(() => {
    const auth = localStorage.getItem('is-authenticated');
    if (auth === 'true') setIsAuthenticated(true);

    const savedGames = localStorage.getItem('forever-mobile-games');
    if (savedGames) {
      try {
        setGames(JSON.parse(savedGames));
      } catch (e) {
        console.error('Failed to load games', e);
      }
    }
  }, []);

  const saveGames = (newGames: Game[]) => {
    setGames(newGames);
    localStorage.setItem('forever-mobile-games', JSON.stringify(newGames));
  };

  const setAuthenticated = (val: boolean) => {
    setIsAuthenticated(val);
    localStorage.setItem('is-authenticated', val ? 'true' : 'false');
  };

  const extractProjectId = (url: string) => {
    const match = url.match(/projects\/(\d+)/);
    return match ? match[1] : null;
  };

  const handleAddGame = (title: string, url: string) => {
    const projectId = extractProjectId(url);
    if (!projectId) return alert('Invalid Scratch URL. Should be like scratch.mit.edu/projects/123456');

    const newGame: Game = {
      id: crypto.randomUUID(),
      projectId,
      title,
      addedAt: Date.now(),
    };
    saveGames([...games, newGame]);
    setShowAddModal(false);
  };

  const handleDeleteGame = (id: string) => {
    const newGames = games.filter(g => g.id !== id);
    saveGames(newGames);
    setShowDeleteModal({ open: false, gameId: null });
  };

  return (
    <div className="min-h-screen bg-[#F9F7F2] text-[#1A1A1A] font-sans selection:bg-[#FFD166]">
      {/* Background patterns */}
      <div className="fixed inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#1A1A1A 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>

      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#F9F7F2]/80 backdrop-blur-md border-b border-[#1A1A1A]/10">
        <div className="max-w-6xl mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-[#FFD166] border-2 border-[#1A1A1A] rounded-full flex items-center justify-center overflow-hidden shadow-[4px_4px_0px_0px_rgba(26,26,26,1)]">
               <img src="/logo.png" alt="FM" className="w-full h-full object-cover" onError={(e) => {
                 (e.target as HTMLImageElement).src = 'https://api.dicebear.com/7.x/identicon/svg?seed=FM';
               }} />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight uppercase">Forever Mobile Games</h1>
              <p className="text-[10px] font-mono text-[#1A1A1A]/50 uppercase tracking-widest leading-none mt-0.5">By Scratch Community</p>
            </div>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-6 py-2.5 bg-[#FF6B6B] text-white border-2 border-[#1A1A1A] font-bold rounded-full shadow-[4px_4px_0px_0px_rgba(26,26,26,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_0px_rgba(26,26,26,1)] transition-all"
          >
            <Plus size={18} />
            <span className="hidden sm:inline">Add Game</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-12 relative z-10">
        {games.length === 0 ? (
          <div className="h-[60vh] flex flex-col items-center justify-center text-center">
            <div className="w-24 h-24 mb-6 bg-[#4ECDC4] border-2 border-[#1A1A1A] rounded-3xl flex items-center justify-center rotate-3 shadow-[8px_8px_0px_0px_rgba(26,26,26,1)]">
              <Gamepad2 size={48} className="text-[#1A1A1A]" />
            </div>
            <h2 className="text-3xl font-black mb-4 uppercase tracking-tight">No Games Yet!</h2>
            <p className="text-[#1A1A1A]/60 max-w-md mx-auto mb-8">
              Start building your collection of Scratch games. Click the "Add Game" button to include your first creation.
            </p>
            <div className="flex gap-4 items-center justify-center text-xs font-mono uppercase text-[#1A1A1A]/40">
               <span className="flex items-center gap-1"><Laptop size={14} /> Desktop Ready</span>
               <span>•</span>
               <span className="flex items-center gap-1"><Smartphone size={14} /> Mobile Optimized</span>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {games.map((game) => (
              <motion.div
                layoutId={game.id}
                key={game.id}
                onClick={() => setSelectedGame(game)}
                className="group cursor-pointer"
                whileHover={{ y: -5 }}
              >
                <div className="bg-white border-2 border-[#1A1A1A] rounded-2xl overflow-hidden shadow-[8px_8px_0px_0px_rgba(26,26,26,1)] transition-all group-hover:shadow-[12px_12px_0px_0px_rgba(26,26,26,1)]">
                  <div className="aspect-video relative overflow-hidden bg-[#1A1A1A]">
                    <img
                      src={`https://uploads.scratch.mit.edu/get_image/project/${game.projectId}_480x360.png`}
                      alt={game.title}
                      className="w-full h-full object-cover transition-transform group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                       <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center scale-75 group-hover:scale-100 transition-transform shadow-lg">
                          <ChevronRight className="text-[#1A1A1A] ml-1" size={24} />
                       </div>
                    </div>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowDeleteModal({ open: true, gameId: game.id });
                      }}
                      className="absolute top-3 right-3 w-8 h-8 bg-white/10 hover:bg-white text-white/40 hover:text-[#FF6B6B] rounded-full flex items-center justify-center backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100 z-20"
                    >
                      <X size={16} />
                    </button>
                  </div>
                  <div className="p-5 flex justify-between items-center bg-white border-t-2 border-[#1A1A1A]">
                    <div>
                      <h3 className="font-bold text-lg truncate pr-4 uppercase tracking-tight leading-tight">{game.title}</h3>
                      <p className="text-[10px] font-mono text-[#1A1A1A]/50 uppercase mt-1">ID: {game.projectId}</p>
                    </div>
                    <div className="w-10 h-10 rounded-full border border-[#1A1A1A]/10 flex items-center justify-center text-[#1A1A1A]/20">
                      <Gamepad2 size={20} />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="py-12 border-t-2 border-[#1A1A1A]/5 mt-12 bg-white/50">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3 grayscale opacity-50">
            <div className="w-8 h-8 bg-[#1A1A1A] rounded-full flex items-center justify-center p-1">
               <img src="/logo.png" alt="FM" className="w-full h-full object-contain" onError={(e) => {
                 (e.target as HTMLImageElement).src = 'https://api.dicebear.com/7.x/identicon/svg?seed=FM';
               }} />
            </div>
            <span className="text-xs font-mono uppercase tracking-widest">Forever Mobile Games</span>
          </div>
          <div className="flex gap-4">
             {['Privacy', 'Terms', 'Support'].map(item => (
                <a key={item} href="#" className="text-[10px] font-mono uppercase text-[#1A1A1A]/40 hover:text-[#FF6B6B] transition-colors">{item}</a>
             ))}
          </div>
          <p className="text-[10px] font-mono text-[#1A1A1A]/30 text-center md:text-right uppercase">
            Built with AI Studio.<br />Games by Scratch Artists.
          </p>
        </div>
      </footer>

      {/* Modals */}
      <AnimatePresence>
        {showAddModal && (
          <Modal onClose={() => setShowAddModal(false)}>
            <AddGameForm 
              onAdd={handleAddGame} 
              isAuthenticated={isAuthenticated} 
              onAuthenticate={() => setAuthenticated(true)} 
            />
          </Modal>
        )}
        {selectedGame && (
          <GameModal game={selectedGame} onClose={() => setSelectedGame(null)} />
        )}
        {showDeleteModal.open && (
          <Modal onClose={() => setShowDeleteModal({ open: false, gameId: null })}>
            <DeleteConfirmForm 
              onDelete={() => showDeleteModal.gameId && handleDeleteGame(showDeleteModal.gameId)} 
              onCancel={() => setShowDeleteModal({ open: false, gameId: null })}
              isAuthenticated={isAuthenticated}
              onAuthenticate={() => setAuthenticated(true)}
            />
          </Modal>
        )}
      </AnimatePresence>
    </div>
  );
}

function Modal({ children, onClose }: { children: ReactNode; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-[#1A1A1A]/60 backdrop-blur-sm"
      />
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        className="relative bg-white border-4 border-[#1A1A1A] rounded-3xl w-full max-w-xl overflow-hidden shadow-[12px_12px_0px_0px_rgba(26,26,26,1)]"
      >
        <button
          onClick={onClose}
          className="absolute top-6 right-6 w-10 h-10 border-2 border-[#1A1A1A] rounded-full flex items-center justify-center bg-[#F9F7F2] hover:bg-[#FF6B6B] hover:text-white transition-colors z-10"
        >
          <X size={20} />
        </button>
        {children}
      </motion.div>
    </div>
  );
}

function DeleteConfirmForm({ onDelete, onCancel, isAuthenticated, onAuthenticate }: { onDelete: () => void; onCancel: () => void; isAuthenticated: boolean; onAuthenticate: () => void }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const checkPassword = () => {
    if (password === 'P271TLimlamswsIf?') {
      onAuthenticate();
      onDelete();
    } else {
      setError('Incorrect password.');
    }
  };

  if (isAuthenticated) {
    return (
      <div className="p-8 sm:p-12 text-center">
        <div className="w-16 h-16 bg-[#FF6B6B] border-2 border-[#1A1A1A] rounded-full flex items-center justify-center mx-auto mb-6 shadow-[4px_4px_0px_0px_rgba(26,26,26,1)]">
          <AlertCircle size={32} className="text-white" />
        </div>
        <h2 className="text-3xl font-black uppercase tracking-tight mb-2">Delete Game?</h2>
        <p className="text-[#1A1A1A]/60 mb-8">Are you sure you want to remove this project? This cannot be undone.</p>
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={onCancel}
            className="py-4 bg-[#F9F7F2] border-2 border-[#1A1A1A] font-black uppercase tracking-widest rounded-xl hover:bg-gray-100 transition-all"
          >
            Go Back
          </button>
          <button
            onClick={onDelete}
            className="py-4 bg-[#FF6B6B] text-white border-2 border-[#1A1A1A] font-black uppercase tracking-widest rounded-xl shadow-[4px_4px_0px_0px_rgba(26,26,26,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_0px_rgba(26,26,26,1)] transition-all"
          >
            Yes, Delete
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 sm:p-12 text-center">
      <div className="w-16 h-16 bg-[#FF6B6B] border-2 border-[#1A1A1A] rounded-full flex items-center justify-center mx-auto mb-6 shadow-[4px_4px_0px_0px_rgba(26,26,26,1)]">
        <AlertCircle size={32} className="text-white" />
      </div>
      <h2 className="text-3xl font-black uppercase tracking-tight mb-2">Delete Game?</h2>
      <p className="text-[#1A1A1A]/60 mb-8">Enter the password to confirm deletion.</p>

      <div className="space-y-4">
        <input
          type="password"
          autoFocus
          placeholder="PASSWORD"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && checkPassword()}
          className="w-full px-6 py-4 bg-[#F9F7F2] border-2 border-[#1A1A1A] rounded-xl focus:outline-none text-center font-mono"
        />
        {error && <p className="text-[#FF6B6B] text-xs font-mono uppercase">{error}</p>}
        <div className="grid grid-cols-2 gap-4 pt-4">
          <button
            onClick={onCancel}
            className="py-4 bg-[#F9F7F2] border-2 border-[#1A1A1A] font-black uppercase tracking-widest rounded-xl hover:bg-gray-100 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={checkPassword}
            className="py-4 bg-[#FF6B6B] text-white border-2 border-[#1A1A1A] font-black uppercase tracking-widest rounded-xl shadow-[4px_4px_0px_0px_rgba(26,26,26,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_0px_rgba(26,26,26,1)] transition-all"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

function AddGameForm({ onAdd, isAuthenticated, onAuthenticate }: { onAdd: (title: string, url: string) => void; isAuthenticated: boolean; onAuthenticate: () => void }) {
  const [step, setStep] = useState(isAuthenticated ? 1 : 0); // 0: Password, 1: Details
  const [password, setPassword] = useState('');
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');

  const checkPassword = () => {
    if (password === 'P271TLimlamswsIf?') {
      onAuthenticate();
      setStep(1);
      setError('');
    } else {
      setError('Incorrect password. Try again.');
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!title || !url) return setError('Please fill all fields.');
    onAdd(title, url);
  };

  return (
    <div className="p-8 sm:p-12">
      {step === 0 ? (
        <div className="space-y-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-[#FFD166] border-2 border-[#1A1A1A] rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-[4px_4px_0px_0px_rgba(26,26,26,1)] -rotate-3">
              <ShieldCheck size={32} />
            </div>
            <h2 className="text-3xl font-black uppercase tracking-tight mb-2">Admin Access</h2>
            <p className="text-[#1A1A1A]/60">Enter the secret password to add new games.</p>
          </div>

          <div className="space-y-4">
            <input
              type="password"
              placeholder="SECRET PASSWORD"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && checkPassword()}
              className="w-full px-6 py-4 bg-[#F9F7F2] border-2 border-[#1A1A1A] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FFD166] text-center font-mono placeholder:text-[#1A1A1A]/20"
            />
            {error && (
              <p className="text-[#FF6B6B] text-xs font-mono uppercase text-center flex items-center justify-center gap-1">
                <AlertCircle size={14} /> {error}
              </p>
            )}
            <button
              onClick={checkPassword}
              className="w-full py-4 bg-[#1A1A1A] text-[#F9F7F2] font-black uppercase tracking-widest rounded-xl hover:bg-[#FFD166] hover:text-[#1A1A1A] transition-all"
            >
              Verify Identity
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-8">
           <div className="text-center">
            <h2 className="text-3xl font-black uppercase tracking-tight mb-2">New Game</h2>
            <p className="text-[#1A1A1A]/60">Paste the Scratch project link below.</p>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-mono uppercase tracking-widest text-[#1A1A1A]/40 pl-1">Game Title</label>
              <input
                autoFocus
                placeholder="SUPER MARIO SCRATCH"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-6 py-4 bg-[#F9F7F2] border-2 border-[#1A1A1A] rounded-xl focus:outline-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-mono uppercase tracking-widest text-[#1A1A1A]/40 pl-1">Scratch URL</label>
              <input
                placeholder="scratch.mit.edu/projects/..."
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="w-full px-6 py-4 bg-[#F9F7F2] border-2 border-[#1A1A1A] rounded-xl focus:outline-none"
              />
            </div>

            {error && (
              <p className="text-[#FF6B6B] text-xs font-mono uppercase text-center flex items-center justify-center gap-1">
                <AlertCircle size={14} /> {error}
              </p>
            )}

            <button
              type="submit"
              className="w-full py-4 bg-[#4ECDC4] text-[#1A1A1A] border-2 border-[#1A1A1A] font-black uppercase tracking-widest rounded-xl shadow-[4px_4px_0px_0px_rgba(26,26,26,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_rgba(26,26,26,1)] transition-all"
            >
              Launch Project
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

function GameModal({ game, onClose }: { game: Game; onClose: () => void }) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  const toggleFullscreen = async () => {
    if (!containerRef.current) return;
    
    try {
      if (!document.fullscreenElement) {
        await containerRef.current.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch (err) {
      console.error('Error attempting to toggle fullscreen:', err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/98"
      />
      <motion.div
        ref={containerRef}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9 }}
        className={`relative bg-black w-full h-full flex flex-col shadow-2xl overflow-hidden ${isFullscreen ? '' : 'max-w-[1600px] md:rounded-3xl md:border-2 border-white/10'}`}
      >
        {/* Header - Hidden in fullscreen or small screens */}
        {!isFullscreen && (
          <div className="flex items-center justify-between p-3 sm:p-4 bg-[#1A1A1A] border-b border-white/5">
             <div className="flex items-center gap-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 border border-white/10 rounded-full flex items-center justify-center overflow-hidden bg-black shadow-inner">
                  <img src={`https://uploads.scratch.mit.edu/get_image/project/${game.projectId}_480x360.png`} className="w-full h-full object-cover" />
                </div>
                <div>
                  <h2 className="text-white font-bold leading-tight uppercase tracking-tight text-[10px] sm:text-sm truncate max-w-[120px] sm:max-w-md">{game.title}</h2>
                  <p className="text-[7px] sm:text-[9px] font-mono text-white/40 uppercase tracking-widest leading-none mt-0.5">Project #{game.projectId}</p>
                </div>
             </div>
             
             <div className="flex items-center gap-2 sm:gap-3">
                <button
                  onClick={toggleFullscreen}
                  className="hidden sm:flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 text-white font-bold uppercase text-[9px] tracking-widest rounded-full transition-all border border-white/5"
                >
                  <Maximize size={14} /> Fullscreen
                </button>
                <a
                  href={`https://scratch.mit.edu/projects/${game.projectId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hidden sm:flex px-4 py-2 bg-white/5 hover:bg-white/10 text-white font-bold uppercase text-[9px] tracking-widest rounded-full transition-all border border-white/5"
                >
                  Scratch Page
                </a>
                <button
                  onClick={onClose}
                  className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border border-white/10 flex items-center justify-center text-white/40 hover:text-[#FF6B6B] hover:border-[#FF6B6B]/20 transition-all bg-white/5"
                >
                  <X size={18} />
                </button>
             </div>
          </div>
        )}

        {/* Game Container - Absolute fill */}
        <div className="flex-1 relative bg-black overflow-hidden">
          <div className={`absolute inset-0 flex items-center justify-center ${isFullscreen ? 'p-0' : 'p-0 md:p-8'}`}>
            <iframe
              src={`https://scratch.mit.edu/projects/${game.projectId}/embed?autostart=true`}
              allowTransparency={true}
              width="100%"
              height="100%"
              frameBorder="0"
              scrolling="no"
              allowFullScreen
              allow="autoplay; fullscreen; microphone; camera; gamepad"
              className={`w-full h-full z-10 ${isFullscreen ? '' : 'md:max-h-full md:max-w-full md:aspect-[4/3] shadow-[0_0_100px_rgba(0,0,0,1)]'}`}
            ></iframe>
          </div>
          
          {/* Floating controls for mobile / fullscreen */}
          <div className="absolute top-4 right-4 z-50 flex gap-2">
            <button
              onClick={toggleFullscreen}
              className={`w-10 h-10 rounded-full bg-black/50 border border-white/20 flex items-center justify-center text-white backdrop-blur-md transition-opacity ${isFullscreen ? 'opacity-20 hover:opacity-100' : 'sm:hidden'}`}
            >
              {isFullscreen ? <Minimize size={20} /> : <Maximize size={20} />}
            </button>
            <button
              onClick={onClose}
              className={`w-10 h-10 rounded-full bg-black/50 border border-white/20 flex items-center justify-center text-white backdrop-blur-md transition-opacity ${isFullscreen ? 'opacity-20 hover:opacity-100' : 'sm:hidden'}`}
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Footer - Only on desktops when not in fullscreen */}
        {!isFullscreen && (
          <div className="hidden md:flex p-3 sm:p-4 bg-[#1A1A1A]/80 backdrop-blur-md justify-between items-center px-6 border-t border-white/5">
             <div className="flex gap-6 items-center">
                <div className="flex flex-col">
                  <span className="text-[7px] font-mono uppercase text-white/20 tracking-widest">Added</span>
                  <span className="text-white/50 font-bold text-[9px] uppercase">{new Date(game.addedAt).toLocaleDateString()}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[7px] font-mono uppercase text-white/20 tracking-widest">Controls</span>
                  <span className="text-white/50 font-bold text-[9px] uppercase flex items-center gap-1">Touch Ready <Smartphone size={10} /></span>
                </div>
             </div>
             <div className="flex gap-4">
               <button 
                 onClick={toggleFullscreen}
                 className="px-8 py-2.5 bg-white/5 hover:bg-white/10 text-white font-black uppercase text-[10px] tracking-widest rounded-full transition-all border border-white/10"
               >
                 Go Fullscreen
               </button>
               <button 
                 onClick={onClose}
                 className="px-8 py-2.5 bg-[#FFD166] hover:bg-[#FFD166]/90 text-[#1A1A1A] font-black uppercase text-[10px] tracking-widest rounded-full transition-all shadow-[0_4px_0_0_#CB9D31] active:translate-y-1 active:shadow-none"
               >
                 Exit Theater
               </button>
             </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
