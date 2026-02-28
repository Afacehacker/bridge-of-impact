import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { donations as donationsAPI, cases as casesAPI, getImageUrl } from '../services/api';
import {
    Users,
    TrendingUp,
    CheckCircle,
    Plus,
    Trash2,
    Edit3,
    LogOut,
    Loader2,
    DollarSign
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AdminDashboard = () => {
    const { user, loading: authLoading, logout } = useAuth();
    const navigate = useNavigate();
    const [stats, setStats] = useState(null);
    const [cases, setCases] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [currentCase, setCurrentCase] = useState({
        title: '', beneficiaryName: '', location: '', category: 'Medical', targetAmount: '', description: '', image: ''
    });
    const [selectedFile, setSelectedFile] = useState(null);

    useEffect(() => {
        if (!authLoading && !user) {
            navigate('/admin/login');
        }
    }, [user, authLoading, navigate]);

    useEffect(() => {
        if (user) {
            fetchData();
        }
    }, [user]);

    const fetchData = async () => {
        try {
            const [statsRes, casesRes] = await Promise.all([
                donationsAPI.getStats(),
                casesAPI.getAll()
            ]);
            setStats(statsRes.data.data);
            setCases(casesRes.data.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleSaveCase = async (e) => {
        e.preventDefault();
        const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
        console.log('Using API Base:', apiBase);
        try {
            let response;
            if (selectedFile) {
                // If a new file is prepared, use FormData
                const formData = new FormData();
                formData.append('title', currentCase.title || '');
                formData.append('beneficiaryName', currentCase.beneficiaryName || '');
                formData.append('location', currentCase.location || '');
                formData.append('category', currentCase.category || 'Medical');
                formData.append('targetAmount', String(currentCase.targetAmount || 0));
                formData.append('description', currentCase.description || '');
                formData.append('image', selectedFile);

                if (currentCase._id) {
                    response = await casesAPI.update(currentCase._id, formData);
                } else {
                    response = await casesAPI.create(formData);
                }
            } else {
                // Regular JSON update if no file is selected
                const data = {
                    title: currentCase.title,
                    beneficiaryName: currentCase.beneficiaryName,
                    location: currentCase.location,
                    category: currentCase.category,
                    targetAmount: currentCase.targetAmount,
                    description: currentCase.description,
                    image: currentCase.image
                };
                if (currentCase._id) {
                    response = await casesAPI.update(currentCase._id, data);
                } else {
                    response = await casesAPI.create(data);
                }
            }

            alert('Case saved successfully!');
            setShowModal(false);
            setCurrentCase({ title: '', beneficiaryName: '', location: '', category: 'Medical', targetAmount: '', description: '', image: '' });
            setSelectedFile(null);
            fetchData();
        } catch (err) {
            console.error('--- Save Case Error ---');
            console.error('Full Error:', err);
            console.error('Base URL:', import.meta.env.VITE_API_URL || 'http://localhost:5000/api');
            console.error('Response Data:', err.response?.data);

            const errorMsg = err.response?.data?.error || err.message || 'Error saving case';
            alert(`Error: ${errorMsg}`);
        }
    };

    const handleDeleteCase = async (id) => {
        if (window.confirm('Are you sure you want to delete this case?')) {
            await casesAPI.delete(id);
            fetchData();
        }
    };

    if (authLoading || loading) return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin text-primary" size={48} /></div>;

    return (
        <div className="pt-24 md:pt-28 pb-24 bg-secondary min-h-screen">
            <div className="container mx-auto px-4 md:px-6">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 md:mb-12 gap-6">
                    <div className="space-y-1">
                        <h1 className="text-2xl md:text-3xl font-bold text-primary">Management Dashboard</h1>
                        <p className="text-slate-500 font-medium text-sm md:text-base">Welcome back, {user?.name}</p>
                    </div>
                    <div className="flex flex-wrap gap-3 md:gap-4 w-full md:w-auto">
                        <button
                            onClick={() => { setCurrentCase({ title: '', beneficiaryName: '', location: '', category: 'Medical', targetAmount: '', description: '', image: '' }); setShowModal(true); }}
                            className="btn-primary flex-1 md:flex-none text-sm md:text-base py-3 px-6"
                        >
                            <Plus size={18} className="mr-2" /> New Case
                        </button>
                        <button onClick={logout} className="btn-outline flex-1 md:flex-none text-sm md:text-base py-3 px-6 border-slate-200 text-slate-500 hover:bg-red-50 hover:text-red-600 hover:border-red-200">
                            <LogOut size={18} className="mr-2" /> Logout
                        </button>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8 md:mb-12">
                    {[
                        { label: 'Total Raised', value: `₦${stats?.totalRaised.toLocaleString()}`, icon: <TrendingUp />, color: 'bg-green-50 text-green-600' },
                        { label: 'Verified Donors', value: stats?.totalDonors, icon: <Users />, color: 'bg-blue-50 text-blue-600' },
                        { label: 'Active Cases', value: stats?.activeCases, icon: <DollarSign />, color: 'bg-amber-50 text-amber-600' },
                        { label: 'Completed', value: stats?.completedCases, icon: <CheckCircle />, color: 'bg-primary/5 text-primary' },
                    ].map((stat, i) => (
                        <div key={i} className="bg-white p-6 md:p-8 rounded-[1.5rem] md:rounded-[2rem] shadow-sm border border-slate-100 space-y-3 md:space-y-4">
                            <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center ${stat.color}`}>
                                {stat.icon}
                            </div>
                            <div>
                                <p className="text-slate-400 text-[10px] md:text-sm font-bold uppercase tracking-widest">{stat.label}</p>
                                <p className="text-xl md:text-2xl font-bold text-slate-800">{stat.value}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Case List */}
                <div className="bg-white rounded-[2rem] md:rounded-[3rem] shadow-sm border border-slate-100 overflow-hidden">
                    <div className="p-6 md:p-10 border-b border-slate-50 flex justify-between items-center">
                        <h2 className="text-lg md:text-xl font-bold text-primary">All Impact Cases</h2>
                        <span className="bg-slate-50 text-slate-400 px-3 py-1 md:px-4 md:py-1.5 rounded-full text-[10px] md:text-xs font-bold uppercase">{cases.length} Total</span>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-slate-50/50 text-slate-400 text-[10px] md:text-xs font-bold uppercase tracking-widest">
                                    <th className="px-6 md:px-10 py-4 md:py-5 whitespace-nowrap">Beneficiary / Title</th>
                                    <th className="px-4 md:px-6 py-4 md:py-5 whitespace-nowrap">Progress</th>
                                    <th className="px-4 md:px-6 py-4 md:py-5 whitespace-nowrap">Target</th>
                                    <th className="px-4 md:px-6 py-4 md:py-5 whitespace-nowrap">Status</th>
                                    <th className="px-6 md:px-10 py-4 md:py-5 text-right whitespace-nowrap">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {cases.map((c) => (
                                    <tr key={c._id} className="hover:bg-slate-50/30 transition-colors">
                                        <td className="px-6 md:px-10 py-4 md:py-6">
                                            <div className="flex items-center gap-3 md:gap-4">
                                                <img src={getImageUrl(c.image)} className="w-10 h-10 md:w-12 md:h-12 rounded-xl object-cover" />
                                                <div>
                                                    <p className="font-bold text-slate-800 text-sm md:text-base">{c.beneficiaryName}</p>
                                                    <p className="text-xs text-slate-400 truncate max-w-[120px] md:max-w-[200px]">{c.title}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 md:px-6 py-4 md:py-6">
                                            <div className="w-24 md:w-32">
                                                <div className="flex justify-between text-[9px] md:text-[10px] font-bold text-slate-400 mb-1">
                                                    <span>{Math.round((c.amountRaised / c.targetAmount) * 100)}%</span>
                                                    <span>₦{c.amountRaised.toLocaleString()}</span>
                                                </div>
                                                <div className="w-full h-1 md:h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                                    <div className="bg-primary h-full" style={{ width: `${(c.amountRaised / c.targetAmount) * 100}%` }} />
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 md:px-6 py-4 md:py-6 font-bold text-slate-600 text-sm md:text-base">₦{c.targetAmount.toLocaleString()}</td>
                                        <td className="px-4 md:px-6 py-4 md:py-6">
                                            <span className={`px-3 py-0.5 md:px-4 md:py-1 rounded-full text-[9px] md:text-[10px] font-bold uppercase tracking-widest ${c.status === 'active' ? 'bg-green-50 text-green-600' : 'bg-slate-100 text-slate-400'
                                                }`}>
                                                {c.status}
                                            </span>
                                        </td>
                                        <td className="px-6 md:px-10 py-4 md:py-6 text-right">
                                            <div className="flex justify-end gap-1 md:gap-2">
                                                <button
                                                    onClick={() => { setCurrentCase(c); setShowModal(true); }}
                                                    className="p-2 md:p-2.5 bg-slate-50 text-slate-400 rounded-xl hover:bg-primary/10 hover:text-primary transition-all"
                                                >
                                                    <Edit3 size={16} md:size={18} />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteCase(c._id)}
                                                    className="p-2 md:p-2.5 bg-slate-50 text-slate-400 rounded-xl hover:bg-red-50 hover:text-red-500 transition-all"
                                                >
                                                    <Trash2 size={16} md:size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Modal for Add/Edit */}
            <AnimatePresence>
                {showModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowModal(false)}
                            className="absolute inset-0 bg-primary/40 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="relative w-full max-w-4xl bg-white rounded-[2rem] md:rounded-[3rem] shadow-2xl p-6 md:p-16 overflow-y-auto max-h-[90vh]"
                        >
                            <h2 className="text-2xl md:text-3xl font-bold text-primary mb-6 md:mb-10">{currentCase._id ? 'Edit Impact Case' : 'Create New Impact Case'}</h2>

                            <form onSubmit={handleSaveCase} className="grid md:grid-cols-2 gap-8">
                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-2">Case Title</label>
                                        <input type="text" required className="w-full h-14 bg-slate-50/50 border border-slate-100 rounded-2xl px-6 focus:outline-none focus:ring-2 focus:ring-primary/20" value={currentCase.title} onChange={e => setCurrentCase({ ...currentCase, title: e.target.value })} />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-2">Beneficiary Name</label>
                                        <input type="text" required className="w-full h-14 bg-slate-50/50 border border-slate-100 rounded-2xl px-6 focus:outline-none focus:ring-2 focus:ring-primary/20" value={currentCase.beneficiaryName} onChange={e => setCurrentCase({ ...currentCase, beneficiaryName: e.target.value })} />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-2">Location (State/LGA)</label>
                                        <input type="text" required className="w-full h-14 bg-slate-50/50 border border-slate-100 rounded-2xl px-6 focus:outline-none focus:ring-2 focus:ring-primary/20" value={currentCase.location} onChange={e => setCurrentCase({ ...currentCase, location: e.target.value })} placeholder="e.g. Lagos Island, Lagos" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-2">Target Amount (₦)</label>
                                        <input type="number" required className="w-full h-14 bg-slate-50/50 border border-slate-100 rounded-2xl px-6 focus:outline-none focus:ring-2 focus:ring-primary/20" value={currentCase.targetAmount} onChange={e => setCurrentCase({ ...currentCase, targetAmount: e.target.value })} />
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-2">Category</label>
                                        <select className="w-full h-14 bg-slate-50/50 border border-slate-100 rounded-2xl px-6 focus:outline-none focus:ring-2 focus:ring-primary/20 appearance-none" value={currentCase.category} onChange={e => setCurrentCase({ ...currentCase, category: e.target.value })}>
                                            <option>Medical</option>
                                            <option>Crisis Relief</option>
                                            <option>Education</option>
                                            <option>Social Welfare</option>
                                        </select>
                                    </div>
                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-2">Case Image (Choose one option below)</label>

                                            {/* File Upload Option */}
                                            <div className="space-y-2">
                                                <p className="text-[10px] text-slate-400 font-bold ml-2 uppercase">Option A: Upload File</p>
                                                <div className="relative h-14 bg-slate-50/50 border border-slate-100 rounded-2xl flex items-center px-6 group hover:border-primary/30 transition-colors">
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        className="absolute inset-0 opacity-0 cursor-pointer z-10"
                                                        onChange={e => {
                                                            setSelectedFile(e.target.files[0]);
                                                            setCurrentCase({ ...currentCase, image: '' }); // Clear URL if file chosen
                                                        }}
                                                    />
                                                    <span className="text-slate-400 text-sm overflow-hidden whitespace-nowrap overflow-ellipsis">
                                                        {selectedFile ? `Selected: ${selectedFile.name}` : (currentCase.image && !currentCase.image.startsWith('http') ? 'Keep Current Upload' : 'Choose image file')}
                                                    </span>
                                                    <Plus size={18} className="ml-auto text-slate-400" />
                                                </div>
                                            </div>

                                            {/* URL Option */}
                                            <div className="space-y-2">
                                                <p className="text-[10px] text-slate-400 font-bold ml-2 uppercase">Option B: Image Web URL (Recommended for Permanent Images)</p>
                                                <input
                                                    type="url"
                                                    placeholder="e.g. https://images.unsplash.com/..."
                                                    className="w-full h-14 bg-slate-50/50 border border-slate-100 rounded-2xl px-6 focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm"
                                                    value={currentCase.image && currentCase.image.startsWith('http') ? currentCase.image : ''}
                                                    onChange={e => {
                                                        setCurrentCase({ ...currentCase, image: e.target.value });
                                                        setSelectedFile(null); // Clear file if URL is typed
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-2">Description</label>
                                        <textarea required className="w-full h-40 bg-slate-50/50 border border-slate-100 rounded-2xl p-6 focus:outline-none focus:ring-2 focus:ring-primary/20" value={currentCase.description} onChange={e => setCurrentCase({ ...currentCase, description: e.target.value })} />
                                    </div>
                                </div>

                                <div className="md:col-span-2 pt-6 flex gap-4">
                                    <button
                                        type="submit"
                                        disabled={!currentCase._id && !selectedFile}
                                        className="btn-primary flex-1 h-16 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Save Impact Case
                                    </button>
                                    <button type="button" onClick={() => setShowModal(false)} className="btn-outline h-16 px-10 border-slate-200 text-slate-400">Cancel</button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AdminDashboard;
