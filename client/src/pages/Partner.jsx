import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, Building2, HeartHandshake, Globe2, Loader2, CheckCircle2 } from 'lucide-react';

const Partner = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        organization: '',
        partnershipType: 'Corporate',
        message: ''
    });
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        setLoading(false);
        setSubmitted(true);
    };

    return (
        <div className="pt-24 min-h-screen bg-white">
            {/* Header Section */}
            <section className="relative py-20 overflow-hidden bg-primary text-white">
                <div className="absolute top-0 right-0 w-96 h-96 bg-accent/10 rounded-full blur-[100px] -mr-48 -mt-48" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/5 rounded-full blur-[80px] -ml-32 -mb-32" />

                <div className="container mx-auto px-4 md:px-6 relative z-10 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="max-w-3xl mx-auto space-y-6"
                    >
                        <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
                            Let's Build a <span className="text-accent italic">Bridge of Impact</span> Together
                        </h1>
                        <p className="text-slate-300 text-lg md:text-xl leading-relaxed">
                            Join our network of corporate partners, medical institutions, and individual advocates working to transform healthcare accessibility in Nigeria.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Content Section */}
            <section className="py-24">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="grid lg:grid-cols-2 gap-20">
                        {/* Info Column */}
                        <div className="space-y-12">
                            <div className="space-y-6">
                                <h2 className="text-3xl md:text-4xl font-bold text-primary">Why Partner with Us?</h2>
                                <p className="text-slate-600 text-lg leading-relaxed">
                                    We provide a transparent, high-impact platform for organizations looking to fulfill their CSR objectives or individuals wanting to make a systemic difference.
                                </p>
                            </div>

                            <div className="grid sm:grid-cols-2 gap-8">
                                {[
                                    {
                                        icon: <Building2 className="text-accent" />,
                                        title: "Corporate CSR",
                                        desc: "Direct your CSR funds to verified, life-saving cases with detailed impact reporting."
                                    },
                                    {
                                        icon: <HeartHandshake className="text-accent" />,
                                        title: "Medical Partners",
                                        desc: "Hospitals and clinics can partner with us to list verified emergency cases."
                                    },
                                    {
                                        icon: <Globe2 className="text-accent" />,
                                        title: "Global Advocacy",
                                        desc: "Help us reach the diaspora and international donors for larger-scale impact."
                                    },
                                    {
                                        icon: <CheckCircle2 className="text-accent" />,
                                        title: "Tax Benefits",
                                        desc: "Our verified NGO status ensures your contributions are legally recognized and impactful."
                                    }
                                ].map((item, i) => (
                                    <div key={i} className="space-y-4">
                                        <div className="w-12 h-12 bg-secondary rounded-xl flex items-center justify-center">
                                            {item.icon}
                                        </div>
                                        <h4 className="font-bold text-primary text-xl">{item.title}</h4>
                                        <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
                                    </div>
                                ))}
                            </div>

                            <div className="p-10 bg-secondary/30 rounded-[3rem] border border-white space-y-6">
                                <h4 className="font-bold text-primary text-2xl tracking-tight">Direct Contact</h4>
                                <div className="space-y-4">
                                    <div className="flex items-center gap-4 text-slate-600">
                                        <Mail className="text-accent" size={20} />
                                        <span>partnership@bridgeofimpact.org</span>
                                    </div>
                                    <div className="flex items-center gap-4 text-slate-600">
                                        <Phone className="text-accent" size={20} />
                                        <span>+234 800 IMPACT NGO</span>
                                    </div>
                                    <div className="flex items-center gap-4 text-slate-600">
                                        <MapPin className="text-accent" size={20} />
                                        <span>Victoria Island, Lagos, Nigeria</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Form Column */}
                        <div className="relative">
                            <div className="sticky top-32">
                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="bg-white rounded-[3rem] border border-slate-100 shadow-2xl p-8 md:p-12"
                                >
                                    {submitted ? (
                                        <div className="text-center py-20 space-y-6">
                                            <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                                                <CheckCircle2 size={40} />
                                            </div>
                                            <h3 className="text-3xl font-bold text-primary">Message Sent!</h3>
                                            <p className="text-slate-500">
                                                Thank you for your interest in partnering with us. Our team will reach out to you within 24-48 hours.
                                            </p>
                                            <button
                                                onClick={() => setSubmitted(false)}
                                                className="btn-primary w-full"
                                            >
                                                Send Another Message
                                            </button>
                                        </div>
                                    ) : (
                                        <form onSubmit={handleSubmit} className="space-y-6">
                                            <div className="space-y-2 text-center mb-8">
                                                <h3 className="text-2xl font-bold text-primary">Partnership Inquiry</h3>
                                                <p className="text-slate-500">Fill out the form below and we'll get in touch.</p>
                                            </div>

                                            <div className="grid sm:grid-cols-2 gap-6">
                                                <div className="space-y-2">
                                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-2">Full Name</label>
                                                    <input
                                                        type="text"
                                                        required
                                                        className="w-full h-14 bg-slate-50 border border-slate-100 rounded-2xl px-6 focus:outline-none focus:ring-2 focus:ring-primary/10 transition-all font-medium"
                                                        placeholder="John Doe"
                                                        value={formData.name}
                                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-2">Email Address</label>
                                                    <input
                                                        type="email"
                                                        required
                                                        className="w-full h-14 bg-slate-50 border border-slate-100 rounded-2xl px-6 focus:outline-none focus:ring-2 focus:ring-primary/10 transition-all font-medium"
                                                        placeholder="john@company.com"
                                                        value={formData.email}
                                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                    />
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-2">Organization/Company</label>
                                                <input
                                                    type="text"
                                                    className="w-full h-14 bg-slate-50 border border-slate-100 rounded-2xl px-6 focus:outline-none focus:ring-2 focus:ring-primary/10 transition-all font-medium"
                                                    placeholder="e.g. HealthCorps Nigeria"
                                                    value={formData.organization}
                                                    onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-2">Partnership Type</label>
                                                <select
                                                    className="w-full h-14 bg-slate-50 border border-slate-100 rounded-2xl px-6 focus:outline-none focus:ring-2 focus:ring-primary/10 transition-all font-medium appearance-none"
                                                    value={formData.partnershipType}
                                                    onChange={(e) => setFormData({ ...formData, partnershipType: e.target.value })}
                                                >
                                                    <option>Corporate Partnership</option>
                                                    <option>Medical/Hospital Partner</option>
                                                    <option>Individual Advocacy</option>
                                                    <option>Media/Press Inquiry</option>
                                                </select>
                                            </div>

                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-2">How can we work together?</label>
                                                <textarea
                                                    rows="4"
                                                    required
                                                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-6 focus:outline-none focus:ring-2 focus:ring-primary/10 transition-all font-medium resize-none"
                                                    placeholder="Tell us about your interest..."
                                                    value={formData.message}
                                                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                                ></textarea>
                                            </div>

                                            <button
                                                type="submit"
                                                disabled={loading}
                                                className="btn-primary w-full h-16 text-lg font-bold flex items-center justify-center gap-2 group"
                                            >
                                                {loading ? (
                                                    <Loader2 className="animate-spin" size={20} />
                                                ) : (
                                                    <>
                                                        Send Proposal <Send size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                                    </>
                                                )}
                                            </button>
                                        </form>
                                    )}
                                </motion.div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Partner;
