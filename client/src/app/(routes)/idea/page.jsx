"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUp, Sparkles, Send, TrendingUp, ChevronDown, MessageSquare, User } from 'lucide-react';
import { useRouter } from 'next/navigation';

// Define the maximum allowed votes
const MAX_VOTES = 3;

export default function IdeasPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('vote');
  const [ideas, setIdeas] = useState([]);
  const [votedIdeaIds, setVotedIdeaIds] = useState([]); 
  const [isLoading, setIsLoading] = useState(true);
  const [userVotes, setUserVotes] = useState(0);
  
  // UI States
  const [expandedIdeaId, setExpandedIdeaId] = useState(null); 
  const [activeCommentId, setActiveCommentId] = useState(null);
  
  // Form States
  const [formData, setFormData] = useState({ title: '', description: '' });
  const [commentInput, setCommentInput] = useState("");
  
  // Processing state
  const [processingVote, setProcessingVote] = useState(null);

  // --- Fetch ideas and user votes on component mount ---
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    await Promise.all([fetchIdeas(), fetchUserVotes()]);
  };

  const fetchIdeas = async () => {
    const token = localStorage.getItem("token");
    
    if (!token) {
      router.push("/login");
      return;
    }
    
    try {
      setIsLoading(true);
      const response = await fetch(`${process.env.NEXT_PUBLIC_DJANGO_URL}/api/ideas/`, {
        method: "GET",
        headers: {
          Authorization: `${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch ideas");
      }

      const data = await response.json();
      setIdeas(data);
    } catch (err) {
      console.log("Error fetching ideas:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch which ideas the current user has voted for
  const fetchUserVotes = async () => {
    const token = localStorage.getItem("token");
    
    if (!token) {
      return;
    }
    
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_DJANGO_URL}/api/user/votes/`, {
        method: "GET",
        headers: {
          Authorization: `${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setVotedIdeaIds(data.voted_idea_ids || []);
        setUserVotes(data.total_votes || 0);
      }
    } catch (err) {
      console.log("Error fetching user votes:", err);
    }
  };

  const handleToggleExpand = (id) => {
    setExpandedIdeaId(expandedIdeaId === id ? null : id);
  };

  const handleToggleComments = (e, id) => {
    e.stopPropagation();
    if (activeCommentId === id) {
      setActiveCommentId(null);
      setCommentInput("");
    } else {
      setActiveCommentId(id);
      setCommentInput("");
    }
  };

  const handleVote = async (id) => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    // Prevent multiple clicks on the same vote button
    if (processingVote === id) return;
    
    setProcessingVote(id);

    const isCurrentlyVoted = votedIdeaIds.includes(id);

    // Check vote limit BEFORE optimistic update
    if (!isCurrentlyVoted && userVotes >= MAX_VOTES) {
      alert(`Vote limit reached! You can only vote for a maximum of ${MAX_VOTES} ideas.`);
      setProcessingVote(null);
      return;
    }

    // Store previous state for rollback
    const previousIdeas = [...ideas];
    const previousVotedIds = [...votedIdeaIds];
    const previousUserVotes = userVotes;

    try {
      // OPTIMISTIC UPDATE
      setIdeas(prev => prev.map(idea => {
        if (idea.id === id) {
          const currentVotes = idea.votes_count !== undefined ? idea.votes_count : (idea.num_votes !== undefined ? idea.num_votes : idea.votes);
          const newVotes = isCurrentlyVoted ? Math.max(0, currentVotes - 1) : currentVotes + 1;
          return {
            ...idea,
            votes_count: newVotes,
            num_votes: newVotes,
            votes: newVotes
          };
        }
        return idea;
      }));

      // Update local state
      if (isCurrentlyVoted) {
        setVotedIdeaIds(prev => prev.filter(votedId => votedId !== id));
        setUserVotes(prev => Math.max(0, prev - 1));
      } else {
        setVotedIdeaIds(prev => [...prev, id]);
        setUserVotes(prev => prev + 1);
      }

      // API CALL
      const response = await fetch(`${process.env.NEXT_PUBLIC_DJANGO_URL}/api/ideas/${id}/vote/`, {
        method: "POST",
        headers: {
          Authorization: `${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ vote: !isCurrentlyVoted })
      });

      if (!response.ok) {
        throw new Error("Vote failed");
      }

      const data = await response.json();
      
      // Update with actual server response
      setIdeas(prev => prev.map(idea => {
        if (idea.id === id) {
          return {
            ...idea,
            votes_count: data.votes_count,
            num_votes: data.votes_count,
            votes: data.votes_count
          };
        }
        return idea;
      }));

      // Refresh user votes to ensure sync
      await fetchUserVotes();
      
    } catch (err) {
      console.log("Vote error:", err);
      
      // ROLLBACK on error
      setIdeas(previousIdeas);
      setVotedIdeaIds(previousVotedIds);
      setUserVotes(previousUserVotes);
      
      alert("Failed to update vote. Please try again.");
    } finally {
      setProcessingVote(null);
    }
  };

  const handleIdeaSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.description.trim()) return;

    const token = localStorage.getItem("token");
    
    try {
      setIsLoading(true);
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_DJANGO_URL}/api/ideas/`, {
        method: "POST",
        headers: {
          Authorization: `${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description
        })
      });

      if (!response.ok) {
        throw new Error("Failed to submit idea");
      }

      const newIdea = await response.json();
      
      setIdeas([newIdea, ...ideas]);
      setFormData({ title: '', description: '' });
      setActiveTab('vote');
      
    } catch (err) {
      console.log("Error submitting idea:", err);
      alert("Failed to submit idea. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

const handleCommentSubmit = async (e, ideaId) => {
    e.preventDefault();
    if (!commentInput.trim()) return;

    const token = localStorage.getItem("token");
    
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_DJANGO_URL}/api/ideas/${ideaId}/comments/`, {
        method: "POST",
        headers: {
          Authorization: `${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: commentInput
        })
      });

      if (!response.ok) {
        throw new Error("Failed to submit comment");
      }

      const newComment = await response.json();

      setIdeas(prev => prev.map(idea => {
        if (idea.id === ideaId) {
          return { 
            ...idea, 
            comments: [...(idea.comments || []), newComment] 
          };
        }
        return idea;
      }));

      setCommentInput("");
      
    } catch (err) {
      console.log("Error submitting comment:", err);
      alert("Failed to submit comment. Please try again.");
    }
  };

  const sortedIdeas = [...ideas].sort((a, b) => {
    const aVotes = a.votes_count !== undefined ? a.votes_count : (a.num_votes !== undefined ? a.num_votes : a.votes || 0);
    const bVotes = b.votes_count !== undefined ? b.votes_count : (b.num_votes !== undefined ? b.num_votes : b.votes || 0);
    return bVotes - aVotes;
  });
  
  const votesRemaining = MAX_VOTES - userVotes;

  // Main loading state
  if (isLoading && ideas.length === 0) {
    return (
      <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-gray-400">Loading ideas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-white selection:text-black font-sans relative scroll-smooth">
      
      {/* --- Background Pattern --- */}
      <div 
        className="absolute inset-0 z-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: `repeating-linear-gradient(45deg, #333 0px, #333 1px, transparent 1px, transparent 10px)`
        }}
      />

      {/* --- Main Content Container --- */}
      <main className="pt-10 pb-20 px-4 max-w-3xl mx-auto relative z-10">
        
        {/* Main Heading */}
        <div className="text-center mb-10 mt-[10vh]">
            <h1 className="text-4xl md:text-5xl font-bold mb-1 tracking-tight">NEXUS Ideas Board</h1>
            <p className="text-gray-400">
              Collaborate. Vote. Build. 
              <span className={`ml-2 font-medium ${votesRemaining === 0 ? 'text-red-400' : 'text-green-400'}`}>
                ({votesRemaining} votes remaining)
              </span>
            </p>
        </div>

        {/* --- Sticky Tab Navigation --- */}
        <nav className="sticky top-0 z-40 w-full mb-8 py-3 bg-[#050505]/90 backdrop-blur-md">
            <div className="mx-auto w-[90%] max-w-md">
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-full px-1 py-1 flex justify-between items-center shadow-2xl">
                    <div className="flex w-full relative">
                        <motion.div 
                        className="absolute top-0 bottom-0 bg-white rounded-full shadow-lg z-0"
                        initial={false}
                        animate={{
                            left: activeTab === 'vote' ? '0%' : '50%',
                            width: '50%'
                        }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        />

                        <button 
                        onClick={() => setActiveTab('vote')}
                        className={`flex-1 relative z-10 py-2 text-xs md:text-sm font-semibold tracking-wide flex items-center justify-center gap-2 transition-colors duration-200 ${activeTab === 'vote' ? 'text-black' : 'text-gray-400 hover:text-white'}`}
                        >
                        <TrendingUp size={16} />
                        Leaderboard
                        </button>
                        <button 
                        onClick={() => setActiveTab('submit')}
                        className={`flex-1 relative z-10 py-2 text-xs md:text-sm font-semibold tracking-wide flex items-center justify-center gap-2 transition-colors duration-200 ${activeTab === 'submit' ? 'text-black' : 'text-gray-400 hover:text-white'}`}
                        >
                        <Sparkles size={16} />
                        Submit Idea
                        </button>
                    </div>
                </div>
            </div>
        </nav>

        <AnimatePresence mode="wait">
          
          {/* VIEW 1: LEADERBOARD */}
          {activeTab === 'vote' && (
            <motion.div
              key="vote"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-4 pt-4"
            >
              {ideas.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-400 text-lg">No ideas yet. Be the first to submit one!</p>
                </div>
              ) : (
                sortedIdeas.map((idea) => {
                  const isExpanded = expandedIdeaId === idea.id;
                  const areCommentsOpen = activeCommentId === idea.id;
                  const isVoted = votedIdeaIds.includes(idea.id);
                  const isDisabled = !isVoted && userVotes >= MAX_VOTES;
                  const isProcessing = processingVote === idea.id;
                  
                  const voteCount = idea.votes_count !== undefined ? idea.votes_count : (idea.num_votes !== undefined ? idea.num_votes : idea.votes || 0);

                  return (
                      <motion.div 
                          key={idea.id}
                          layout
                          className="group relative bg-white/5 border border-white/10 hover:border-white/20 rounded-2xl p-4 md:p-6 transition-all duration-300 hover:bg-white/[0.07]"
                      >
                      
                      {/* Vote Counter Pill */}
                      <div 
                          className={`absolute top-0 right-0 m-4 md:m-6 flex items-center justify-center min-w-[50px] px-3 py-1 rounded-full text-black font-bold text-sm transition-all duration-300 shadow-xl 
                          ${isVoted ? 'bg-white' : 'bg-gray-400/80 group-hover:bg-white'}`}
                      >
                          {voteCount}
                      </div>

                      <div className="flex items-start gap-4 md:gap-6">
                          
                          {/* Upvote Button with Glow Effect when Voted */}
                          <button 
                          onClick={(e) => {
                              e.stopPropagation();
                              handleVote(idea.id);
                          }}
                          disabled={isDisabled || isProcessing}
                          className={`relative flex flex-col items-center justify-center min-w-[30px] h-[30px] rounded-full border transition-all duration-200 mt-2 
                              ${
                              isVoted 
                              ? 'bg-white text-black border-white shadow-[0_0_15px_rgba(255,255,255,0.5)]' 
                              : isDisabled
                                  ? 'bg-transparent text-gray-700 border-white/5 cursor-not-allowed opacity-50' 
                                  : 'bg-transparent text-gray-400 border-white/10 hover:border-white hover:text-white' 
                              }
                              ${isProcessing ? 'opacity-50 cursor-wait' : ''}
                          `}
                          >
                          {isVoted && !isProcessing && (
                            <div className="absolute inset-0 rounded-full bg-white/20 animate-ping opacity-75"></div>
                          )}
                          <ArrowUp 
                            size={16} 
                            className={`relative z-10 ${isVoted ? 'stroke-[3px]' : 'stroke-1'} ${isProcessing ? 'animate-pulse' : ''}`}
                          />
                          </button>

                          {/* Content Area */}
                          <div className="flex-1 overflow-hidden pr-16">
                              {/* Click title/desc to expand read more */}
                              <div className="cursor-pointer" onClick={() => handleToggleExpand(idea.id)}>
                                  <h3 className="text-lg md:text-xl font-semibold text-white mb-2">{idea.title}</h3>
                                  
                                  <motion.div
                                      initial={false}
                                      animate={{ maxHeight: isExpanded ? "500px" : "4.5rem" }} 
                                      transition={{ duration: 0.5, ease: "easeInOut" }}
                                      className="overflow-hidden text-gray-400 text-sm md:text-base relative"
                                  >
                                      <p className="leading-relaxed mb-4">{idea.description}</p>
                                      
                                      {!isExpanded && (
                                          <div className="absolute inset-x-0 bottom-0 h-16 pointer-events-none">
                                              <div 
                                                  className="absolute inset-x-0 bottom-0 h-full" 
                                                  style={{ background: 'linear-gradient(to top, #121212 0%, #121212 0%, transparent 100%)' }}
                                              />
                                              <div className="absolute bottom-0 inset-x-0 flex justify-center pb-2">
                                                  <span className="inline-flex items-center text-xs font-semibold text-white/90 bg-white/5 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20 transition-all duration-300 pointer-events-auto shadow-md">
                                                      Read More
                                                      <ChevronDown size={14} className="ml-1" />
                                                  </span>
                                              </div>
                                          </div>
                                      )}
                                  </motion.div>
                              </div>

                              {/* --- COMMENT TOGGLE BUTTON --- */}
                              <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between">
                                  <button
                                      onClick={(e) => handleToggleComments(e, idea.id)}
                                      className={`flex items-center gap-2 text-xs md:text-sm font-medium transition-colors duration-200 
                                      ${areCommentsOpen ? 'text-indigo-400' : 'text-gray-500 hover:text-white'}`}
                                  >
                                      <MessageSquare size={16} />
                                      {idea.comments?.length || 0} Comments
                                  </button>
                              </div>

                              {/* --- COMMENT SECTION (Collapsible) --- */}
                              <AnimatePresence>
                                  {areCommentsOpen && (
                                      <motion.div
                                          initial={{ height: 0, opacity: 0 }}
                                          animate={{ height: "auto", opacity: 1 }}
                                          exit={{ height: 0, opacity: 0 }}
                                          transition={{ duration: 0.3 }}
                                          className="overflow-hidden"
                                      >
                                          <div className="mt-4 bg-black/40 rounded-xl p-4 border border-white/5">
                                              
                                              {/* Existing Comments List */}
                                              <div className="space-y-4 mb-6 max-h-[300px] overflow-y-auto custom-scrollbar">
                                                  {(!idea.comments || idea.comments.length === 0) ? (
                                                      <p className="text-center text-gray-600 text-sm italic py-2">No comments yet. Be the first!</p>
                                                  ) : (
                                                      idea.comments.map((comment) => (
                                                          <div key={comment.id} className="flex gap-3">
                                                              <div className="mt-1 w-6 h-6 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                                                                  <User size={12} className="text-gray-400" />
                                                              </div>
                                                              <div className="flex-1">
                                                                  <div className="flex items-center gap-2 mb-1">
                                                                      <span className="text-xs font-bold text-gray-300">{comment.author}</span>
                                                                      <span className="text-[10px] text-gray-600">{comment.time}</span>
                                                                  </div>
                                                                  <p className="text-sm text-gray-400 leading-snug">{comment.text}</p>
                                                              </div>
                                                          </div>
                                                      ))
                                                  )}
                                              </div>

                                              {/* Comment Input */}
                                              <form onSubmit={(e) => handleCommentSubmit(e, idea.id)} className="relative">
                                                  <input
                                                      type="text"
                                                      value={commentInput}
                                                      onChange={(e) => setCommentInput(e.target.value)}
                                                      placeholder="Add a comment..."
                                                      className="w-full bg-white/5 border border-white/10 rounded-lg pl-4 pr-12 py-3 text-sm text-white focus:outline-none focus:bg-white/10 focus:border-white/20 transition-all placeholder-gray-600"
                                                  />
                                                  <button 
                                                      type="submit"
                                                      disabled={!commentInput.trim()}
                                                      className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-md text-gray-400 hover:text-white hover:bg-white/10 disabled:opacity-50 disabled:hover:bg-transparent transition-all"
                                                  >
                                                      <Send size={16} />
                                                  </button>
                                              </form>
                                          </div>
                                      </motion.div>
                                  )}
                              </AnimatePresence>

                          </div>
                      </div>
                      </motion.div>
                  );
                })
              )}
            </motion.div>
          )}

          {/* VIEW 2: SUBMIT IDEA */}
          {activeTab === 'submit' && (
            <motion.div
              key="submit"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="max-w-xl mx-auto pt-4"
            >
              <div className="text-center mb-10">
                <h1 className="text-3xl font-bold mb-4 tracking-tight">Share Your Idea</h1>
                <p className="text-gray-400">Submit an idea anonymously for community review.</p>
              </div>

              <form onSubmit={handleIdeaSubmit} className="space-y-6 bg-white/5 border border-white/10 p-6 md:p-8 rounded-3xl backdrop-blur-sm">
                
                <div className="space-y-2">
                  <label htmlFor="title" className="text-sm font-medium text-gray-300 ml-1">Title</label>
                  <input
                    id="title"
                    type="text"
                    placeholder="e.g. Campus Navigation App"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-white/40 focus:ring-1 focus:ring-white/40 transition-all"
                    required
                    disabled={isLoading}
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="desc" className="text-sm font-medium text-gray-300 ml-1">Description</label>
                  <textarea
                    id="desc"
                    rows={5}
                    placeholder="Describe the problem and your solution..."
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-white/40 focus:ring-1 focus:ring-white/40 transition-all resize-none"
                    required
                    disabled={isLoading}
                  />
                </div>

                <button 
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-white text-black font-bold py-4 rounded-xl hover:bg-gray-200 transition-colors flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-black"></div>
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <>
                      <span>Submit to Leaderboard</span>
                      <Send size={18} className="group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>

              </form>
            </motion.div>
          )}

        </AnimatePresence>
      </main>
    </div>
  );
}