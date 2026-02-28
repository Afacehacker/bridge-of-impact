import { useState, useEffect } from 'react';
import { cases as casesAPI } from '../services/api';
import CaseCard from '../components/cases/CaseCard';
import { Search, Filter, Loader2 } from 'lucide-react';

const Cases = () => {
    const [activeCases, setActiveCases] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState('All');

    useEffect(() => {
        const fetchCases = async () => {
            try {
                const res = await casesAPI.getAll();
                setActiveCases(res.data.data);
            } catch (err) {
                console.error('Failed to fetch cases', err);
            } finally {
                setLoading(false);
            }
        };
        fetchCases();
    }, []);

    const filteredCases = activeCases.filter(c => {
        const matchesSearch = c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            c.beneficiaryName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            c.location.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filter === 'All' || c.category === filter;
        return matchesSearch && matchesFilter;
    });

    return (
        <div className="pt-32 pb-24 min-h-screen">
            <div className="container mx-auto px-4 md:px-6">
                <div className="max-w-4xl mx-auto text-center mb-16 space-y-4">
                    <h1 className="text-4xl md:text-6xl font-bold text-primary">Active Fundraising Cases</h1>
                    <p className="text-slate-600 text-lg">Every case listed here has been verified by our team for authenticity and direct impact.</p>
                </div>

                {/* Filters */}
                <div className="flex flex-col md:flex-row gap-6 mb-12 items-center justify-between">
                    <div className="relative w-full md:max-w-md group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={20} />
                        <input
                            type="text"
                            placeholder="Search by name, location, or condition..."
                            className="w-full pl-12 pr-4 h-14 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/10 transition-all"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className="flex gap-2 overflow-x-auto pb-2 w-full md:w-auto scrollbar-hide">
                        {['All', 'Medical', 'Crisis Relief', 'Education', 'Social Welfare'].map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setFilter(cat)}
                                className={`px-6 py-3 rounded-2xl text-sm font-bold transition-all whitespace-nowrap ${filter === cat
                                        ? 'bg-primary text-white shadow-lg'
                                        : 'bg-white text-slate-500 border border-slate-100 hover:border-primary/30'
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-4">
                        <Loader2 className="animate-spin text-primary" size={48} />
                        <p className="font-bold text-primary animate-pulse">Fetching Verified Cases from Nigeria...</p>
                    </div>
                ) : filteredCases.length > 0 ? (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredCases.map((c) => (
                            <CaseCard key={c._id} caseData={c} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 glass rounded-[3rem] border border-slate-100">
                        <p className="text-xl font-bold text-slate-400">No cases found matching your criteria.</p>
                        <button
                            onClick={() => { setSearchTerm(''); setFilter('All'); }}
                            className="mt-4 text-primary font-bold hover:underline"
                        >
                            Clear all filters
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Cases;
