import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { cases as casesAPI, donations as donationsAPI, getImageUrl } from '../services/api';
import { Loader2, MapPin, Share2, ShieldCheck, ArrowLeft, Heart, CreditCard, Users } from 'lucide-react';
import { motion } from 'framer-motion';

const CaseDetail = () => {
    const { id } = useParams();
    const [fundraisingCase, setFundraisingCase] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isDonating, setIsDonating] = useState(false);
    const [form, setForm] = useState({ amount: '', email: '', name: '' });
    const [status, setStatus] = useState({ type: '', message: '' });

    useEffect(() => {
        const fetchCase = async () => {
            try {
                const res = await casesAPI.getOne(id);
                setFundraisingCase(res.data.data);
            } catch (err) {
                console.error('Error fetching case', err);
            } finally {
                setLoading(false);
            }
        };
        fetchCase();
    }, [id]);

    const [donationDetails, setDonationDetails] = useState(null);

    const handleDonation = async (e) => {
        e.preventDefault();
        if (!form.amount || !form.email) {
            return setStatus({ type: 'error', message: 'Please fill in amount and email' });
        }

        try {
            setIsDonating(true);
            const res = await donationsAPI.initialize({
                ...form,
                caseId: id
            });

            if (res.data.isManual) {
                setDonationDetails(res.data.data);
                setStatus({
                    type: 'success',
                    message: 'Donation initialization successful. Please complete the bank transfer below.'
                });
            } else {
                // Original Paystack flow (if ever re-enabled)
                const handler = window.PaystackPop.setup({
                    key: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY || 'pk_test_your_public_key',
                    email: form.email,
                    amount: form.amount * 100,
                    ref: res.data.data.reference,
                    onClose: () => setIsDonating(false),
                    callback: () => {
                        setIsDonating(false);
                        setStatus({ type: 'success', message: 'Thank you for your donation!' });
                    }
                });
                handler.openIframe();
            }
        } catch (err) {
            console.error(err);
            setStatus({ type: 'error', message: 'Could not initialize donation' });
        } finally {
            setIsDonating(false);
        }
    };

    if (loading) return (
        <div className="flex h-screen items-center justify-center">
            <Loader2 className="animate-spin text-primary" size={48} />
        </div>
    );

    if (!fundraisingCase) return (
        <div className="pt-32 text-center">
            <h2 className="text-2xl font-bold">Case not found</h2>
            <Link to="/cases" className="text-primary hover:underline">Back to cases</Link>
        </div>
    );

    const percentage = Math.round((fundraisingCase.amountRaised / fundraisingCase.targetAmount) * 100);

    return (
        <div className="pt-24 md:pt-28 pb-24 bg-secondary/30">
            <div className="container mx-auto px-4 md:px-6">
                <Link to="/cases" className="inline-flex items-center gap-2 text-slate-500 hover:text-primary transition-colors mb-6 md:mb-8 font-semibold">
                    <ArrowLeft size={18} />
                    Back to Active Cases
                </Link>

                <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
                    {/* Left Column: Details */}
                    <div className="lg:col-span-2 space-y-8 md:space-y-10">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white rounded-[2rem] md:rounded-[3rem] overflow-hidden shadow-sm border border-slate-100"
                        >
                            <img
                                src={getImageUrl(fundraisingCase.image)}
                                alt={fundraisingCase.title}
                                className="w-full h-[300px] md:h-[450px] object-cover"
                            />
                            <div className="p-6 md:p-14 space-y-6 md:space-y-8">
                                <div className="flex flex-wrap gap-2 md:gap-3">
                                    <span className="bg-primary text-white px-4 md:px-5 py-1.5 md:py-2 rounded-full text-[10px] md:text-xs font-bold uppercase tracking-widest">{fundraisingCase.category}</span>
                                    <span className="bg-slate-100 text-slate-500 px-4 md:px-5 py-1.5 md:py-2 rounded-full text-[10px] md:text-xs font-bold uppercase tracking-widest flex items-center gap-1">
                                        <MapPin size={14} /> {fundraisingCase.location}
                                    </span>
                                </div>

                                <h1 className="text-3xl md:text-5xl font-bold text-primary tracking-tight leading-tight">
                                    {fundraisingCase.title}
                                </h1>

                                <div className="flex items-center gap-3 md:gap-4 py-4 md:py-6 border-y border-slate-50">
                                    <div className="w-12 h-12 md:w-14 md:h-14 bg-accent/20 rounded-xl md:rounded-2xl flex items-center justify-center text-accent">
                                        <Heart size={24} md:size={28} fill="currentColor" />
                                    </div>
                                    <div>
                                        <p className="text-slate-400 text-[10px] md:text-sm font-medium uppercase tracking-tighter">Beneficiary</p>
                                        <p className="text-lg md:text-xl font-bold text-primary">{fundraisingCase.beneficiaryName}</p>
                                    </div>
                                </div>

                                <div className="prose prose-slate max-w-none">
                                    <h3 className="text-xl md:text-2xl font-bold text-primary">About this case</h3>
                                    <p className="text-base md:text-lg text-slate-600 leading-relaxed whitespace-pre-wrap">
                                        {fundraisingCase.description}
                                    </p>
                                </div>

                                <div className="bg-blue-50/50 p-6 md:p-8 rounded-2xl md:rounded-3xl flex items-start gap-3 md:gap-4 border border-blue-100">
                                    <ShieldCheck className="text-blue-600 shrink-0" size={24} md:size={32} />
                                    <div>
                                        <h4 className="font-bold text-blue-900 text-base md:text-lg">Verified Safety</h4>
                                        <p className="text-blue-800/70 text-xs md:text-sm leading-relaxed">
                                            All funds for this case are protected by Bridge of Impact Initiative. We ensure direct disbursement to verified medical providers or the beneficiary.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Right Column: Donation Card */}
                    <div className="space-y-6 md:space-y-8">
                        <div className="sticky top-32 glass p-6 md:p-10 rounded-[2rem] md:rounded-[3rem] border border-white shadow-xl space-y-6 md:space-y-8">
                            <div>
                                <div className="flex justify-between items-end mb-4">
                                    <span className="text-primary font-bold text-2xl md:text-3xl">₦{fundraisingCase.amountRaised.toLocaleString()}</span>
                                    <span className="text-slate-400 font-medium text-sm md:text-base">Goal: ₦{fundraisingCase.targetAmount.toLocaleString()}</span>
                                </div>
                                <div className="relative w-full h-4 bg-slate-100/50 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${percentage}%` }}
                                        transition={{ duration: 1.5 }}
                                        className="absolute top-0 left-0 h-full bg-primary rounded-full"
                                    />
                                </div>
                                <div className="flex justify-between items-center mt-3 text-sm font-bold text-slate-500">
                                    <span>{percentage}% Raised</span>
                                    <span>₦{(fundraisingCase.targetAmount - fundraisingCase.amountRaised).toLocaleString()} Left</span>
                                </div>
                            </div>

                            <form onSubmit={handleDonation} className="space-y-5">
                                <h4 className="font-bold text-primary text-xl">Make a difference</h4>

                                {status.message && (
                                    <div className={`p-4 rounded-2xl text-sm font-medium ${status.type === 'success' ? 'bg-green-100 text-green-700' :
                                        status.type === 'error' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                                        }`}>
                                        {status.message}
                                    </div>
                                )}

                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-2">Amount (₦)</label>
                                    <input
                                        type="number"
                                        placeholder="e.g. 5000"
                                        required
                                        className="w-full h-14 bg-white/50 border border-slate-200 rounded-2xl px-6 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-bold text-primary"
                                        value={form.amount}
                                        onChange={(e) => setForm({ ...form, amount: e.target.value })}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-2">Email Address</label>
                                    <input
                                        type="email"
                                        placeholder="your@email.com"
                                        required
                                        className="w-full h-14 bg-white/50 border border-slate-200 rounded-2xl px-6 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                                        value={form.email}
                                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-2">Full Name (Optional)</label>
                                    <input
                                        type="text"
                                        placeholder="Your Name (leaves as Anonymous if blank)"
                                        className="w-full h-14 bg-white/50 border border-slate-200 rounded-2xl px-6 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                                        value={form.name}
                                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={isDonating || fundraisingCase.status === 'completed' || !!donationDetails}
                                    className="w-full btn-primary h-16 text-lg tracking-wide disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isDonating ? <Loader2 className="animate-spin mr-2" /> : <CreditCard className="mr-2" />}
                                    {fundraisingCase.status === 'completed' ? 'Goal Reached!' : donationDetails ? 'Please Complete Transfer' : 'Initialize Donation'}
                                </button>

                                {donationDetails && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="p-8 bg-primary text-white rounded-[2rem] border border-white/20 space-y-6 shadow-2xl relative overflow-hidden"
                                    >
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-accent/10 rounded-full -mr-16 -mt-16 blur-2xl" />
                                        <div className="text-center space-y-2">
                                            <p className="text-xs font-bold text-accent uppercase tracking-widest">Bank Transfer Details</p>
                                            <h5 className="text-xl font-bold">Manual Payment</h5>
                                        </div>

                                        <div className="space-y-4">
                                            <div className="bg-white/5 p-4 rounded-xl border border-white/10 hover:bg-white/10 transition-colors group cursor-pointer" onClick={() => {
                                                navigator.clipboard.writeText(donationDetails.accountNumber);
                                                alert('Account number copied!');
                                            }}>
                                                <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest mb-1">Account Number</p>
                                                <p className="text-2xl font-mono font-bold tracking-widest flex justify-between items-center text-accent">
                                                    {donationDetails.accountNumber}
                                                    <Share2 size={16} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                                                </p>
                                            </div>

                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                                                    <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest mb-1">Bank Name</p>
                                                    <p className="font-bold">{donationDetails.bankName}</p>
                                                </div>
                                                <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                                                    <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest mb-1">Total Amount</p>
                                                    <p className="font-bold">₦{Number(donationDetails.totalToPay).toLocaleString()}</p>
                                                </div>
                                            </div>

                                            <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                                                <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest mb-1">Account Name</p>
                                                <p className="font-bold text-accent">{donationDetails.accountName}</p>
                                            </div>
                                        </div>

                                        <div className="pt-4 border-t border-white/10 text-[10px] text-center italic text-slate-400">
                                            Please send a screenshot of the receipt to <br />
                                            <span className="text-white not-italic font-bold">support@bridgeofimpact.org</span> <br />
                                            or WhatsApp <span className="text-white not-italic font-bold">+234 802 532 9616</span> for verification.
                                        </div>
                                    </motion.div>
                                )}

                                <p className="text-center text-xs text-slate-400 font-medium">
                                    Securely processed via Bank Transfer
                                </p>
                            </form>

                            <div className="pt-6 border-t border-slate-100 flex justify-between items-center">
                                <button
                                    onClick={() => {
                                        if (navigator.share) {
                                            navigator.share({
                                                title: fundraisingCase.title,
                                                text: `Let's support ${fundraisingCase.beneficiaryName} on Bridge of Impact.`,
                                                url: window.location.href,
                                            });
                                        } else {
                                            navigator.clipboard.writeText(window.location.href);
                                            alert('Link copied to clipboard!');
                                        }
                                    }}
                                    className="flex items-center gap-2 text-primary font-bold hover:opacity-80 transition-opacity"
                                >
                                    <Share2 size={18} />
                                    Share Appeal
                                </button>
                                <div className="flex gap-2 text-slate-300">
                                    <Users size={18} />
                                    <span className="text-sm font-bold text-slate-500">Active Appeal</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CaseDetail;
