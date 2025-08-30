import React, { useState, useEffect } from 'react';
import { 
  Clock, 
  Play, 
  Download, 
  Trash2, 
  Search, 
  Filter,
  Calendar,
  Volume2,
  FileText,
  ArrowLeft
} from 'lucide-react';

const HistoryPage = ({ onNavigate, user }) => {
  const [historyItems, setHistoryItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTone, setFilterTone] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchHistory = async () => {
      if (!user?.id) { setError('User not found'); setIsLoading(false); return; }
      try {
        const response = await fetch(`http://localhost:5000/history/${user.id}`);
        if (response.ok) { const data = await response.json(); setHistoryItems(data.history || []); }
        else {
          setError('Failed to load history');
          const saved = localStorage.getItem('echoverse_history'); if (saved) setHistoryItems(JSON.parse(saved));
        }
      } catch (e) {
        setError('Error loading history');
        const saved = localStorage.getItem('echoverse_history'); if (saved) setHistoryItems(JSON.parse(saved));
      } finally { setIsLoading(false); }
    }; fetchHistory();
  }, [user]);

  const filteredAndSortedItems = historyItems
    .filter(item => {
      const originalText = item.original_text || item.originalText || '';
      const rewrittenText = item.rewritten_text || item.rewrittenText || '';
      const matchesSearch = originalText.toLowerCase().includes(searchTerm.toLowerCase()) || rewrittenText.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesTone = filterTone === 'all' || item.tone === filterTone; return matchesSearch && matchesTone; })
    .sort((a,b)=>{ switch (sortBy){ case 'newest': return new Date(b.created_at||b.timestamp||b.updated_at)-new Date(a.created_at||a.timestamp||a.updated_at); case 'oldest': return new Date(a.created_at||a.timestamp||a.updated_at)-new Date(b.created_at||b.timestamp||b.updated_at); case 'tone': return a.tone.localeCompare(b.tone); default: return 0; }});

  const deleteHistoryItem = async (id) => { try { const response = await fetch(`http://localhost:5000/history/${id}`, { method:'DELETE', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ user_email: user.email }) }); if (response.ok){ setHistoryItems(prev=>prev.filter(i=>i.id!==id)); } else { const updated = historyItems.filter(i=>i.id!==id); setHistoryItems(updated); localStorage.setItem('echoverse_history', JSON.stringify(updated)); } } catch { const updated = historyItems.filter(i=>i.id!==id); setHistoryItems(updated); localStorage.setItem('echoverse_history', JSON.stringify(updated)); } };

  const clearAllHistory = () => { setHistoryItems([]); localStorage.removeItem('echoverse_history'); };

  const formatDate = (ts) => { if(!ts) return 'Invalid Date'; const d = new Date(ts); if (isNaN(d.getTime())) return 'Invalid Date'; const now=new Date(); const diff=now-d; const mins=Math.floor(diff/60000); const hrs=Math.floor(diff/3600000); const days=Math.floor(diff/86400000); const timeStr=d.toLocaleTimeString('en-US',{hour:'2-digit',minute:'2-digit',hour12:true}); if(mins<1) return `Just now • ${timeStr}`; if(mins<60) return `${mins} min ago • ${timeStr}`; if(hrs<24) return `${hrs} hours ago • ${timeStr}`; if(days===1) return `Yesterday • ${timeStr}`; if(days<=7) return `${days} days ago • ${timeStr}`; return `${d.toLocaleDateString('en-US',{month:'short',day:'numeric',year: d.getFullYear()!==now.getFullYear()? 'numeric': undefined})} • ${timeStr}`; };
  const getToneColor = (tone) => ({neutral:'from-blue-400 to-cyan-500',suspenseful:'from-purple-500 to-pink-600',inspiring:'from-orange-400 to-red-500',cheerful:'from-yellow-400 to-orange-400',sad:'from-blue-300 to-gray-400',angry:'from-red-600 to-orange-700',playful:'from-pink-400 to-purple-400',calm:'from-green-300 to-blue-300',confident:'from-indigo-500 to-blue-700'})[tone] || 'from-blue-400 to-cyan-500';
  const wordCount = t => t? t.split(/\s+/).filter(w=>w.length>0).length:0;

  return (<div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50"> <div className="absolute inset-0 overflow-hidden"> <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"/> <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse delay-1000"/> <div className="absolute top-40 left-40 w-60 h-60 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse delay-500"/> </div> <div className="relative z-10 container mx-auto px-6 py-8 pt-24"> <div className="flex items-center mb-8"> <button onClick={()=>onNavigate('home')} className="mr-4 p-2 rounded-xl bg-white/80 backdrop-blur-lg shadow-lg hover:shadow-xl transition-all duration-300"> <ArrowLeft className="w-6 h-6 text-gray-600"/> </button> <div> <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-800 via-purple-600 to-blue-600 bg-clip-text text-transparent">History</h1> <p className="text-gray-600 mt-2">Your audiobook creation history</p> </div> </div> <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-2xl border border-gray-200 mb-6"> <div className="flex flex-col lg:flex-row gap-4"> <div className="flex-1 relative"> <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"/> <input type="text" placeholder="Search your history..." value={searchTerm} onChange={e=>setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-3 bg-gray-100 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"/> </div> <div className="relative"> <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"/> <select value={filterTone} onChange={e=>setFilterTone(e.target.value)} className="pl-10 pr-8 py-3 bg-gray-100 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent appearance-none"> <option value="all">All Tones</option><option value="neutral">Neutral</option><option value="cheerful">Cheerful</option><option value="suspenseful">Suspenseful</option><option value="inspiring">Inspiring</option><option value="sad">Sad</option><option value="angry">Angry</option><option value="playful">Playful</option><option value="calm">Calm</option><option value="confident">Confident</option></select> </div> <div className="relative"> <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"/> <select value={sortBy} onChange={e=>setSortBy(e.target.value)} className="pl-10 pr-8 py-3 bg-gray-100 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent appearance-none"> <option value="newest">Newest First</option><option value="oldest">Oldest First</option><option value="tone">By Tone</option></select> </div> {historyItems.length>0 && <button onClick={clearAllHistory} className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl transition-all duration-300 flex items-center space-x-2"> <Trash2 className="w-4 h-4"/><span>Clear All</span></button>} </div> </div> {isLoading && <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-12 shadow-2xl border border-gray-200 text-center"> <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"/> <p className="text-gray-600">Loading your history...</p></div>} {error && !isLoading && <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-12 shadow-2xl border border-gray-200 text-center"> <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4"> <Clock className="w-8 h-8 text-red-500"/> </div> <h3 className="text-xl font-semibold text-gray-600 mb-2">Error Loading History</h3> <p className="text-gray-500">{error}</p></div>} {!isLoading && !error && <div className="space-y-6"> {filteredAndSortedItems.length===0 ? <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-12 shadow-2xl border border-gray-200 text-center"> <Clock className="w-16 h-16 text-gray-400 mx-auto mb-4"/> <h3 className="text-xl font-semibold text-gray-600 mb-2">No History Found</h3> <p className="text-gray-500">{searchTerm || filterTone!=='all' ? 'No items match your search criteria.' : 'Start creating audiobooks to see your history here.'}</p></div> : filteredAndSortedItems.map(item=> <div key={item.id} className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-2xl border border-gray-200 hover:shadow-3xl transition-all duration-300"> <div className="flex items-start justify-between mb-4"> <div className="flex items-center space-x-3"> <div className={`w-12 h-12 bg-gradient-to-r ${getToneColor(item.tone)} rounded-xl flex items-center justify-center`}> <FileText className="w-6 h-6 text-white"/> </div> <div> <div className="flex items-center space-x-2"> <span className={`px-3 py-1 bg-gradient-to-r ${getToneColor(item.tone)} text-white text-sm rounded-full font-medium`}>{item.tone.charAt(0).toUpperCase()+item.tone.slice(1)}</span> <span className="text-sm text-gray-500 flex items-center"> <Volume2 className="w-4 h-4 mr-1"/>{item.voice.charAt(0).toUpperCase()+item.voice.slice(1)}</span> </div> <p className="text-sm text-gray-500 mt-1">{formatDate(item.created_at || item.timestamp || item.updated_at)}</p> </div> </div> <button onClick={()=>deleteHistoryItem(item.id)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all duration-200"> <Trash2 className="w-4 h-4"/> </button> </div> <div className="grid md:grid-cols-2 gap-4 mb-4"> <div> <div className="flex items-center justify-between mb-2"> <h4 className="text-sm font-semibold text-gray-600">Original Text</h4> <span className="text-xs text-gray-400">{(item.original_text||item.originalText||'').length} chars • {wordCount(item.original_text||item.originalText)} words</span> </div> <div className="bg-gray-100 rounded-xl p-3 text-sm text-gray-800 max-h-32 overflow-y-auto">{item.original_text||item.originalText||'No original text available'}</div> </div> <div> <div className="flex items-center justify-between mb-2"> <h4 className="text-sm font-semibold text-gray-600">Rewritten Text</h4> <span className="text-xs text-gray-400">{(item.rewritten_text||item.rewrittenText||'').length} chars • {wordCount(item.rewritten_text||item.rewrittenText)} words</span> </div> <div className="bg-gray-100 rounded-xl p-3 text-sm text-gray-800 max-h-32 overflow-y-auto">{item.rewritten_text||item.rewrittenText||'No rewritten text available'}</div> </div> </div> <div className="flex items-center justify-between"> <div className="flex items-center space-x-2"> {(item.audio_generated||item.audioGenerated)? <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full flex items-center"><span className="w-2 h-2 bg-green-500 rounded-full mr-1 animate-pulse"/>Audio Generated</span> : <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full flex items-center"><span className="w-2 h-2 bg-yellow-500 rounded-full mr-1"/>{item.processing_status || 'Pending'}</span>} <span className="text-xs text-gray-500">ID: {item.id}</span> </div> <div className="flex space-x-2"> {(item.audio_generated||item.audioGenerated) && <> <button className="p-2 bg-purple-100 hover:bg-purple-200 text-purple-600 rounded-lg transition-all duration-200 group" title="Play Audio"> <Play className="w-4 h-4 group-hover:scale-110 transition-transform"/> </button> <button onClick={() => {
            // record a download event for this history item
            fetch('http://localhost:5000/downloads', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                user_id: user.id,
                history_id: item.id,
                tone: item.tone,
                voice: item.voice,
                original_text: item.original_text || item.originalText,
                rewritten_text: item.rewritten_text || item.rewrittenText,
                filename: `history-${item.id}.wav`,
                source: 'history'
              })
            }).then(r=>{ if(!r.ok) console.warn('Failed to record download'); });
          }} className="p-2 bg-green-100 hover:bg-green-200 text-green-600 rounded-lg transition-all duration-200 group" title="Download Audio"> <Download className="w-4 h-4 group-hover:scale-110 transition-transform"/> </button> </>} </div> </div> </div>) } </div>} </div> </div>);
};

export default HistoryPage;
