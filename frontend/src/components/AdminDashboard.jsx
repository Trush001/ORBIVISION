import React, { useState, useEffect, useCallback } from 'react';
import { 
  Lock, X, Trash2, RefreshCw, 
  Mail, Phone, MessageSquare, AlertCircle, 
  Search, ShieldCheck
} from 'lucide-react';
import { getApiUrl } from '../api/client';

export default function AdminDashboard({ isOpen, onClose }) {
  const [token, setToken] = useState(() => localStorage.getItem('orbivision_admin_token') || '');
  const [loginCreds, setLoginCreds] = useState({ username_or_email: '', password: '' });
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  // Tabs: 'inquiries' | 'overview'
  const [activeTab, setActiveTab] = useState('inquiries');

  // Inquiries State
  const [inquiries, setInquiries] = useState([]);
  const [inquiriesLoading, setInquiriesLoading] = useState(false);
  const [inquiryFilter, setInquiryFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [notesDraft, setNotesDraft] = useState('');
  const [statusUpdating, setStatusUpdating] = useState(false);

  // Stats State
  const [stats, setStats] = useState({ total_inquiries: 0, new_inquiries: 0, total_services: 0 });

  // Handle Login
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    setLoginLoading(true);

    try {
      const res = await fetch(getApiUrl('/api/admin/login'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginCreds),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || 'Authentication failed. Please verify credentials.');
      }

      const data = await res.json();
      localStorage.setItem('orbivision_admin_token', data.access_token);
      setToken(data.access_token);
      setLoginCreds({ username_or_email: '', password: '' });
    } catch (err) {
      setLoginError(err.message || 'Incorrect credentials');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('orbivision_admin_token');
    setToken('');
    setInquiries([]);
    setSelectedInquiry(null);
  };

  // Fetch Stats
  const fetchStats = useCallback(async () => {
    if (!token) return;
    try {
      const res = await fetch(getApiUrl('/api/admin/stats'), {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      } else if (res.status === 401) {
        handleLogout();
      }
    } catch (e) {
      console.error('Failed to fetch stats:', e);
    }
  }, [token]);

  // Fetch Inquiries
  const fetchInquiries = useCallback(async () => {
    if (!token) return;
    setInquiriesLoading(true);
    try {
      const params = new URLSearchParams();
      if (inquiryFilter && inquiryFilter !== 'all') {
        params.append('status_filter', inquiryFilter);
      }
      if (searchQuery.trim()) {
        params.append('search', searchQuery.trim());
      }
      const url = getApiUrl(`/api/inquiries?${params.toString()}`);
      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setInquiries(data);
      } else if (res.status === 401) {
        handleLogout();
      }
    } catch (e) {
      console.error('Failed to fetch inquiries:', e);
    } finally {
      setInquiriesLoading(false);
    }
  }, [token, inquiryFilter, searchQuery]);

  useEffect(() => {
    let ignore = false;
    if (isOpen && token) {
      Promise.resolve().then(() => {
        if (!ignore) {
          fetchStats();
          fetchInquiries();
        }
      });
    }
    return () => { ignore = true; };
  }, [isOpen, token, fetchStats, fetchInquiries]);

  // Update Inquiry Status & Notes
  const handleUpdateInquiry = async (inquiryId, newStatus, notes) => {
    setStatusUpdating(true);
    try {
      const payload = {};
      if (newStatus !== undefined) payload.status = newStatus;
      if (notes !== undefined) payload.notes = notes;

      const res = await fetch(getApiUrl(`/api/inquiries/${inquiryId}`), {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        const updated = await res.json();
        setInquiries(prev => prev.map(item => item.id === inquiryId ? updated : item));
        if (selectedInquiry?.id === inquiryId) {
          setSelectedInquiry(updated);
        }
        fetchStats();
      }
    } catch (e) {
      console.error('Failed to update inquiry:', e);
    } finally {
      setStatusUpdating(false);
    }
  };

  // Delete Inquiry
  const handleDeleteInquiry = async (inquiryId) => {
    if (!window.confirm('Are you sure you want to delete this inquiry record? This action cannot be undone.')) return;
    try {
      const res = await fetch(getApiUrl(`/api/inquiries/${inquiryId}`), {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setInquiries(prev => prev.filter(item => item.id !== inquiryId));
        if (selectedInquiry?.id === inquiryId) setSelectedInquiry(null);
        fetchStats();
      }
    } catch (e) {
      console.error('Failed to delete inquiry:', e);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-xl animate-in fade-in">
      <div className="relative w-full max-w-6xl h-[92vh] bg-[#0c0c12] border border-white/10 rounded-3xl shadow-2xl flex flex-col overflow-hidden">
        
        {/* Top Header */}
        <div className="px-6 py-4 border-b border-white/[0.08] flex items-center justify-between bg-[#11111a]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-display font-bold text-lg text-white flex items-center gap-2">
                <span>ORBIVISION</span>
                <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  Admin Terminal
                </span>
              </h2>
              <p className="text-xs text-neutral-400">Client Lead Management & Operational Telemetry</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {token && (
              <button
                onClick={handleLogout}
                className="px-3.5 py-1.5 text-xs font-mono text-neutral-400 hover:text-white bg-neutral-900 border border-white/10 rounded-lg transition-colors cursor-pointer"
              >
                Sign Out
              </button>
            )}
            <button
              onClick={onClose}
              aria-label="Close Admin Modal"
              className="p-2 text-neutral-400 hover:text-white bg-neutral-900/80 hover:bg-neutral-800 rounded-xl transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Area */}
        {!token ? (
          /* Authentication Screen (Empty initial values, zero credentials exposed) */
          <div className="flex-1 flex items-center justify-center p-6 bg-grid-pattern">
            <div className="w-full max-w-md glass-panel rounded-2xl p-8 border border-white/10 shadow-2xl">
              <div className="text-center mb-6">
                <div className="w-12 h-12 rounded-2xl bg-purple-500/20 border border-purple-500/30 mx-auto flex items-center justify-center text-purple-400 mb-3">
                  <Lock className="w-6 h-6" />
                </div>
                <h3 className="font-display font-bold text-xl text-white">Administrator Access</h3>
                <p className="text-xs text-neutral-400 mt-1">Authenticate to access inquiry telemetry and management.</p>
              </div>

              {loginError && (
                <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center gap-2.5 text-red-300 text-xs">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{loginError}</span>
                </div>
              )}

              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-xs font-mono text-neutral-300 mb-1.5">Username or Email</label>
                  <input
                    type="text"
                    required
                    value={loginCreds.username_or_email}
                    onChange={(e) => setLoginCreds(prev => ({ ...prev, username_or_email: e.target.value }))}
                    placeholder="Enter admin identifier"
                    className="w-full px-4 py-2.5 rounded-xl bg-neutral-900/80 border border-white/10 text-white placeholder-neutral-500 text-sm focus:outline-none focus:border-purple-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-neutral-300 mb-1.5">Password</label>
                  <input
                    type="password"
                    required
                    value={loginCreds.password}
                    onChange={(e) => setLoginCreds(prev => ({ ...prev, password: e.target.value }))}
                    placeholder="Enter administrative password"
                    className="w-full px-4 py-2.5 rounded-xl bg-neutral-900/80 border border-white/10 text-white placeholder-neutral-500 text-sm focus:outline-none focus:border-purple-500 transition-colors"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loginLoading}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-sky-500 text-white font-semibold text-sm shadow-lg shadow-purple-600/30 hover:shadow-purple-600/50 transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                >
                  {loginLoading ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <span>Authenticate</span>
                  )}
                </button>
              </form>
            </div>
          </div>
        ) : (
          /* Authenticated Dashboard */
          <div className="flex-1 flex flex-col overflow-hidden">
            
            {/* Sub-header Navigation & Controls */}
            <div className="px-6 py-3 border-b border-white/[0.08] bg-[#0f0f17] flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveTab('inquiries')}
                  className={`px-4 py-1.5 rounded-xl text-xs font-mono font-medium transition-colors cursor-pointer ${
                    activeTab === 'inquiries' 
                      ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30' 
                      : 'text-neutral-400 hover:text-white hover:bg-white/[0.05]'
                  }`}
                >
                  Client Inquiries ({stats.total_inquiries})
                </button>
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`px-4 py-1.5 rounded-xl text-xs font-mono font-medium transition-colors cursor-pointer ${
                    activeTab === 'overview' 
                      ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30' 
                      : 'text-neutral-400 hover:text-white hover:bg-white/[0.05]'
                  }`}
                >
                  Agency Telemetry
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => { fetchStats(); fetchInquiries(); }}
                  title="Refresh Data"
                  className="p-1.5 text-neutral-400 hover:text-white bg-neutral-900 border border-white/10 rounded-lg transition-colors cursor-pointer"
                >
                  <RefreshCw className={`w-4 h-4 ${inquiriesLoading ? 'animate-spin text-purple-400' : ''}`} />
                </button>
              </div>
            </div>

            {/* Tab: Inquiries */}
            {activeTab === 'inquiries' && (
              <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
                
                {/* Left: Inquiries List Table */}
                <div className={`flex-1 flex flex-col border-r border-white/[0.08] overflow-hidden ${selectedInquiry ? 'hidden md:flex' : 'flex'}`}>
                  
                  {/* Search and Filter Bar */}
                  <div className="p-4 border-b border-white/[0.06] bg-[#0c0c12] space-y-3">
                    <div className="relative">
                      <Search className="w-4 h-4 text-neutral-500 absolute left-3 top-3" />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search by client name, email, phone, or service..."
                        className="w-full pl-9 pr-4 py-2 rounded-xl bg-neutral-900/80 border border-white/10 text-white placeholder-neutral-500 text-xs focus:outline-none focus:border-purple-500"
                      />
                    </div>

                    <div className="flex flex-wrap items-center gap-1.5">
                      {['all', 'new', 'contacted', 'in_progress', 'completed', 'archived'].map((f) => (
                        <button
                          key={f}
                          onClick={() => setInquiryFilter(f)}
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-mono capitalize transition-all cursor-pointer ${
                            inquiryFilter === f 
                              ? 'bg-white/15 text-white border border-white/20 font-semibold' 
                              : 'text-neutral-400 hover:text-white hover:bg-white/[0.04]'
                          }`}
                        >
                          {f.replace('_', ' ')}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* List Body */}
                  <div className="flex-1 overflow-y-auto divide-y divide-white/[0.04]">
                    {inquiriesLoading && inquiries.length === 0 ? (
                      <div className="p-12 text-center text-neutral-500 text-xs font-mono">
                        <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-purple-400" />
                        Loading inquiries...
                      </div>
                    ) : inquiries.length === 0 ? (
                      <div className="p-12 text-center text-neutral-500 text-xs font-mono">
                        No inquiries found matching criteria.
                      </div>
                    ) : (
                      inquiries.map((inq) => {
                        const isSelected = selectedInquiry?.id === inq.id;
                        return (
                          <div
                            key={inq.id}
                            onClick={() => {
                              setSelectedInquiry(inq);
                              setNotesDraft(inq.notes || '');
                            }}
                            className={`p-4 transition-colors cursor-pointer hover:bg-white/[0.03] ${
                              isSelected ? 'bg-purple-950/20 border-l-2 border-purple-500' : ''
                            }`}
                          >
                            <div className="flex items-start justify-between gap-2 mb-1">
                              <span className="font-semibold text-sm text-white truncate">{inq.full_name}</span>
                              <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded-full ${
                                inq.status === 'new' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                                inq.status === 'contacted' ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30' :
                                inq.status === 'in_progress' ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' :
                                inq.status === 'completed' ? 'bg-neutral-500/20 text-neutral-300' :
                                'bg-neutral-800 text-neutral-500'
                              }`}>
                                {inq.status}
                              </span>
                            </div>

                            <p className="text-xs text-sky-400 font-mono mb-1">{inq.service_required}</p>
                            <p className="text-xs text-neutral-400 line-clamp-2 leading-relaxed">{inq.project_description}</p>

                            <div className="mt-2.5 flex items-center justify-between text-[11px] text-neutral-500 font-mono">
                              <span>{inq.company || inq.email}</span>
                              <span>{inq.created_at ? new Date(inq.created_at).toLocaleDateString() : ''}</span>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>

                {/* Right: Selected Inquiry Detail View */}
                {selectedInquiry ? (
                  <div className="w-full md:w-[480px] lg:w-[540px] bg-[#0e0e16] flex flex-col overflow-y-auto p-6 space-y-6">
                    <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
                      <div>
                        <span className="text-xs font-mono text-purple-400">Inquiry #{selectedInquiry.id}</span>
                        <h3 className="font-display font-bold text-xl text-white mt-0.5">{selectedInquiry.full_name}</h3>
                      </div>
                      <button
                        onClick={() => setSelectedInquiry(null)}
                        className="p-1.5 text-neutral-400 hover:text-white bg-neutral-900 rounded-lg cursor-pointer md:hidden"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Direct Contact Action Badges */}
                    <div className="grid grid-cols-3 gap-2">
                      <a
                        href={`mailto:${selectedInquiry.email}`}
                        className="p-2.5 rounded-xl bg-neutral-900 border border-white/10 hover:border-purple-500/30 text-xs font-mono text-center text-neutral-200 flex flex-col items-center gap-1.5 transition-colors"
                      >
                        <Mail className="w-4 h-4 text-purple-400" />
                        <span>Email</span>
                      </a>
                      <a
                        href={`tel:${selectedInquiry.phone}`}
                        className="p-2.5 rounded-xl bg-neutral-900 border border-white/10 hover:border-sky-500/30 text-xs font-mono text-center text-neutral-200 flex flex-col items-center gap-1.5 transition-colors"
                      >
                        <Phone className="w-4 h-4 text-sky-400" />
                        <span>Call</span>
                      </a>
                      <a
                        href={`https://wa.me/${selectedInquiry.phone.replace(/[^0-9]/g, '')}`}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2.5 rounded-xl bg-neutral-900 border border-white/10 hover:border-emerald-500/30 text-xs font-mono text-center text-neutral-200 flex flex-col items-center gap-1.5 transition-colors"
                      >
                        <MessageSquare className="w-4 h-4 text-emerald-400" />
                        <span>WhatsApp</span>
                      </a>
                    </div>

                    {/* Metadata fields */}
                    <div className="space-y-3 bg-neutral-950/60 p-4 rounded-2xl border border-white/[0.06] text-xs">
                      <div>
                        <span className="text-neutral-500 font-mono block">Email:</span>
                        <span className="text-neutral-200">{selectedInquiry.email}</span>
                      </div>
                      <div>
                        <span className="text-neutral-500 font-mono block">Phone:</span>
                        <span className="text-neutral-200">{selectedInquiry.phone}</span>
                      </div>
                      <div>
                        <span className="text-neutral-500 font-mono block">Company:</span>
                        <span className="text-neutral-200">{selectedInquiry.company || 'Not specified'}</span>
                      </div>
                      <div>
                        <span className="text-neutral-500 font-mono block">Service Requested:</span>
                        <span className="text-sky-300 font-medium">{selectedInquiry.service_required}</span>
                      </div>
                      <div>
                        <span className="text-neutral-500 font-mono block">Scope / Timeline:</span>
                        <span className="text-purple-300 font-medium">{selectedInquiry.project_budget || 'Custom Scope'}</span>
                      </div>
                    </div>

                    {/* Description */}
                    <div>
                      <h4 className="text-xs font-mono uppercase text-neutral-400 mb-2">Project Brief / Description</h4>
                      <div className="p-4 rounded-2xl bg-neutral-900/80 border border-white/[0.06] text-xs text-neutral-200 leading-relaxed whitespace-pre-wrap">
                        {selectedInquiry.project_description}
                      </div>
                    </div>

                    {/* Status Update Dropdown */}
                    <div>
                      <h4 className="text-xs font-mono uppercase text-neutral-400 mb-2">Lead Workflow Status</h4>
                      <div className="flex flex-wrap gap-2">
                        {['new', 'contacted', 'in_progress', 'completed', 'archived'].map((st) => (
                          <button
                            key={st}
                            disabled={statusUpdating}
                            onClick={() => handleUpdateInquiry(selectedInquiry.id, st, undefined)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-mono capitalize transition-all cursor-pointer ${
                              selectedInquiry.status === st
                                ? 'bg-purple-600 text-white font-semibold shadow-md'
                                : 'bg-neutral-900 text-neutral-400 hover:text-white border border-white/10'
                            }`}
                          >
                            {st.replace('_', ' ')}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Internal Notes */}
                    <div>
                      <h4 className="text-xs font-mono uppercase text-neutral-400 mb-2">Internal Admin Notes</h4>
                      <textarea
                        rows={3}
                        value={notesDraft}
                        onChange={(e) => setNotesDraft(e.target.value)}
                        placeholder="Add notes about calls, client preferences, or follow-ups..."
                        className="w-full p-3 rounded-xl bg-neutral-900 border border-white/10 text-white text-xs placeholder-neutral-500 focus:outline-none focus:border-purple-500 resize-none"
                      />
                      <div className="mt-2 flex justify-end">
                        <button
                          onClick={() => handleUpdateInquiry(selectedInquiry.id, undefined, notesDraft)}
                          disabled={statusUpdating}
                          className="px-4 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-mono transition-colors cursor-pointer"
                        >
                          Save Notes
                        </button>
                      </div>
                    </div>

                    {/* Danger Zone */}
                    <div className="pt-4 border-t border-white/[0.08] flex justify-between items-center">
                      <span className="text-[11px] text-neutral-500 font-mono">
                        Submitted: {selectedInquiry.created_at ? new Date(selectedInquiry.created_at).toLocaleString() : ''}
                      </span>
                      <button
                        onClick={() => handleDeleteInquiry(selectedInquiry.id)}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono text-red-400 hover:text-red-300 bg-red-950/30 hover:bg-red-900/40 border border-red-500/20 rounded-lg transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete Record</span>
                      </button>
                    </div>

                  </div>
                ) : (
                  <div className="hidden md:flex flex-1 items-center justify-center p-12 text-center text-neutral-500 text-xs font-mono">
                    Select an inquiry from the list to view full client brief and manage lead status.
                  </div>
                )}
              </div>
            )}

            {/* Tab: Overview Telemetry */}
            {activeTab === 'overview' && (
              <div className="flex-1 p-6 overflow-y-auto space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-5 rounded-2xl bg-neutral-900/70 border border-white/[0.08]">
                    <span className="text-xs font-mono text-neutral-400 uppercase">Total Inquiries</span>
                    <h4 className="font-display font-bold text-3xl text-white mt-1">{stats.total_inquiries}</h4>
                    <span className="text-[11px] text-neutral-500 font-mono mt-1 block">Lifetime lead submissions</span>
                  </div>

                  <div className="p-5 rounded-2xl bg-purple-950/30 border border-purple-500/30">
                    <span className="text-xs font-mono text-purple-300 uppercase">New Inquiries</span>
                    <h4 className="font-display font-bold text-3xl text-purple-400 mt-1">{stats.new_inquiries}</h4>
                    <span className="text-[11px] text-purple-300/70 font-mono mt-1 block">Awaiting founder review</span>
                  </div>

                  <div className="p-5 rounded-2xl bg-neutral-900/70 border border-white/[0.08]">
                    <span className="text-xs font-mono text-neutral-400 uppercase">Active Services</span>
                    <h4 className="font-display font-bold text-3xl text-sky-400 mt-1">{stats.total_services}</h4>
                    <span className="text-[11px] text-neutral-500 font-mono mt-1 block">Catalog capabilities</span>
                  </div>
                </div>

                <div className="p-6 rounded-2xl bg-neutral-900/50 border border-white/[0.08]">
                  <h4 className="font-display font-bold text-base text-white mb-3">Founder Notification Channels</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl bg-neutral-950/80 border border-white/[0.05]">
                      <span className="text-xs font-mono text-purple-400 block mb-1">Om Makwana</span>
                      <p className="text-sm text-neutral-200">826458om@gmail.com</p>
                      <p className="text-xs text-neutral-400 font-mono mt-0.5">+91 9426231338</p>
                    </div>
                    <div className="p-4 rounded-xl bg-neutral-950/80 border border-white/[0.05]">
                      <span className="text-xs font-mono text-sky-400 block mb-1">Trushal Parmar</span>
                      <p className="text-sm text-neutral-200">trushalmparmar96@gmail.com</p>
                      <p className="text-xs text-neutral-400 font-mono mt-0.5">+91 8733070464</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

          </div>
        )}

      </div>
    </div>
  );
}
