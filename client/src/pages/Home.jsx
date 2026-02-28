import { useState, useEffect } from 'react';
import Hero from '../components/home/Hero';
import { motion } from 'framer-motion';
import { ShieldCheck, HeartPulse, Lock, CheckCircle2, ArrowRight, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cases as casesAPI } from '../services/api';
import CaseCard from '../components/cases/CaseCard';

const Home = () => {
    const [featuredCases, setFeaturedCases] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFeatured = async () => {
            try {
                const res = await casesAPI.getAll();
                // Take the first 3 for featured
                setFeaturedCases(res.data.data.slice(0, 3));
            } catch (err) {
                console.error('Error fetching featured cases', err);
            } finally {
                setLoading(false);
            }
        };
        fetchFeatured();
    }, []);

    return (
        <div>
            <Hero />

            {/* How It Works Section */}
            <section id="how-it-works" className="py-24 bg-white relative overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-secondary/20 blur-[120px] rounded-full -z-10 opacity-60" />
                <div className="container mx-auto px-4 md:px-6">
                    <div className="max-w-3xl mx-auto text-center mb-20 space-y-4">
                        <h2 className="text-accent font-bold uppercase tracking-widest text-sm">Our Methodology</h2>
                        <h3 className="text-4xl md:text-5xl font-bold text-primary italic">The Bridge to Verified Impact</h3>
                        <p className="text-slate-600">We maintain the highest standards of transparency to ensure every Naira you donate reaches those who need it most.</p>
                    </div>

                    <div className="grid md:grid-cols-4 gap-8 relative">
                        {/* Step Line */}
                        <div className="hidden md:block absolute top-[2.5rem] left-[15%] right-[15%] h-[2px] bg-slate-100 -z-0" />

                        {[
                            {
                                icon: <ShieldCheck size={32} />,
                                title: "1. Verified Needs",
                                desc: "No anonymous cases. We personally visit hospitals, verify CAC registrations, and validate every medical report before it goes live."
                            },
                            {
                                icon: <HeartPulse size={32} />,
                                title: "2. Transparent Appeal",
                                desc: "Stories are published with clear goals. You can see precisely who you are helping and what the funds will be used for."
                            },
                            {
                                icon: <Lock size={32} />,
                                title: "3. Direct Impact",
                                desc: "Your donation is secured by Paystack. We disburse directly to verified service providers to ensure 100% utility."
                            },
                            {
                                icon: <CheckCircle2 size={32} />,
                                title: "4. Proof of Life",
                                desc: "Once the goal is met, we publish impact reports and 'Proof of Life' updates so you can see the results of your kindness."
                            }
                        ].map((step, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.15, duration: 0.8 }}
                                className="relative z-10 group"
                            >
                                <div className="p-8 rounded-[2.5rem] bg-white border border-slate-50 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 space-y-6">
                                    <div className="w-16 h-16 bg-primary/5 rounded-2xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300">
                                        {step.icon}
                                    </div>
                                    <h4 className="font-bold text-xl text-primary">{step.title}</h4>
                                    <p className="text-slate-500 text-sm leading-relaxed">{step.desc}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Featured Cases Section */}
            <section className="py-24 bg-secondary/20">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
                        <div className="max-w-2xl space-y-4">
                            <h2 className="text-accent font-bold uppercase tracking-widest text-sm">Active Appeals</h2>
                            <h3 className="text-4xl md:text-5xl font-bold text-primary leading-tight">Needs that <span className="italic">Require Immediate</span> Impact</h3>
                            <p className="text-slate-600 text-lg">Every case on our platform is vigorously verified. Your contribution goes directly to saving a verified life today.</p>
                        </div>
                        <Link to="/cases" className="flex items-center btn-outline border-primary/20 text-primary hover:bg-primary hover:text-white group h-14 px-8">
                            Explore All Cases <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>

                    {loading ? (
                        <div className="flex justify-center py-20">
                            <Loader2 className="animate-spin text-primary" size={48} />
                        </div>
                    ) : (
                        <div className="grid md:grid-cols-1 lg:grid-cols-3 gap-10">
                            {featuredCases.length > 0 ? (
                                featuredCases.map((c) => (
                                    <CaseCard key={c._id} caseData={c} />
                                ))
                            ) : (
                                <div className="col-span-3 text-center py-20 bg-white rounded-[3rem] border border-dashed border-slate-200">
                                    <p className="text-slate-400 font-medium italic">No active cases at the moment. Check back soon!</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </section>

            {/* Stats / Transparency Section */}
            <section id="transparency" className="py-24 bg-primary text-white relative">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
                <div className="container mx-auto px-4 md:px-6 relative z-10">
                    <div className="grid lg:grid-cols-2 gap-20 items-center">
                        <div className="space-y-8">
                            <h2 className="text-accent font-bold uppercase tracking-widest text-sm">Transparency Report</h2>
                            <h3 className="text-4xl md:text-5xl font-bold leading-tight">Every kobo is <br />accounted for.</h3>
                            <p className="text-slate-300 text-lg leading-relaxed">
                                We believe in radical transparency. Our real-time dashboard shows exactly how much has been raised and how many lives have been touched across Nigeria.
                            </p>
                            <div className="grid grid-cols-2 gap-8">
                                <div>
                                    <p className="text-accent text-4xl font-bold mb-1">₦42M+</p>
                                    <p className="text-slate-400 text-sm">Total Funds Raised</p>
                                </div>
                                <div>
                                    <p className="text-accent text-4xl font-bold mb-1">1,250+</p>
                                    <p className="text-slate-400 text-sm">Verified Donors</p>
                                </div>
                                <div>
                                    <p className="text-accent text-4xl font-bold mb-1">85+</p>
                                    <p className="text-slate-400 text-sm">Completed Cases</p>
                                </div>
                                <div>
                                    <p className="text-accent text-4xl font-bold mb-1">100%</p>
                                    <p className="text-slate-400 text-sm">Verified Impact</p>
                                </div>
                            </div>
                        </div>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            className="bg-white/10 backdrop-blur-md rounded-[3rem] p-10 border border-white/10"
                        >
                            <div className="space-y-8">
                                <div className="flex items-center justify-between pb-6 border-b border-white/10">
                                    <h4 className="font-bold text-xl">Recent Direct Impact</h4>
                                    <Link to="/cases" className="text-accent text-sm font-semibold flex items-center gap-1 hover:underline">
                                        View All <ArrowRight size={14} />
                                    </Link>
                                </div>
                                {[
                                    { name: "Kidney Transplant (Abuja)", progress: 95, amount: "₦4,850,000" },
                                    { name: "Emergency Surgery (Lagos)", progress: 100, amount: "₦1,200,000" },
                                    { name: "Education Support (Ibadan)", progress: 60, amount: "₦450,000" },
                                ].map((item, i) => (
                                    <div key={i} className="space-y-3">
                                        <div className="flex justify-between text-sm font-medium">
                                            <span>{item.name}</span>
                                            <span className="text-accent">{item.amount}</span>
                                        </div>
                                        <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                whileInView={{ width: `${item.progress}%` }}
                                                viewport={{ once: true }}
                                                transition={{ duration: 1, delay: i * 0.2 }}
                                                className={`h-full ${item.progress === 100 ? 'bg-green-400' : 'bg-accent'}`}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section className="py-24 bg-white overflow-hidden">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="max-w-3xl mx-auto text-center mb-20 space-y-4">
                        <h2 className="text-accent font-bold uppercase tracking-widest text-sm">Impact & Voices</h2>
                        <h3 className="text-4xl md:text-5xl font-bold text-primary italic">Stories of Transformed Lives</h3>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                text: "I lost all hope when my son needed surgery. Bridge of Impact didn't just raise the money, they verified everything with the hospital and paid directly. Today, my son is healthy.",
                                author: "Mrs. Adejoke Bello",
                                location: "Lagos, Nigeria",
                                role: "Beneficiary"
                            },
                            {
                                text: "As a donor, my biggest fear is scams. This initiative's verification process is the best I've seen in Nigeria. I feel safe knowing my donation is actually saving a life.",
                                author: "Dr. Emeka Okafor",
                                location: "Abuja, Nigeria",
                                role: "Monthly Donor"
                            },
                            {
                                text: "The transparency is incredible. Getting constant updates on the child I supported made me feel like part of their healing journey. 100% recommended.",
                                author: "Sarah Johnson",
                                location: "Port Harcourt",
                                role: "Community Donor"
                            }
                        ].map((t, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, scale: 0.95 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="bg-secondary/10 p-10 rounded-[3rem] border border-white space-y-6 relative"
                            >
                                <div className="text-4xl text-accent/20 absolute top-8 left-8 font-serif leading-none">“</div>
                                <p className="text-slate-600 italic leading-relaxed relative z-10">{t.text}</p>
                                <div className="pt-6 border-t border-slate-100 flex items-center gap-4">
                                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold">
                                        {t.author[0]}
                                    </div>
                                    <div>
                                        <p className="font-bold text-primary">{t.author}</p>
                                        <p className="text-slate-400 text-xs italic">{t.location} • {t.role}</p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Newsletter Section */}
            <section className="py-24 bg-primary relative overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-accent/10 rounded-full blur-[100px] -mr-48 -mt-48" />
                <div className="container mx-auto px-4 md:px-6 relative z-10">
                    <div className="bg-white/5 backdrop-blur-3xl rounded-[4rem] p-12 md:p-20 border border-white/10 text-center space-y-8 max-w-5xl mx-auto">
                        <div className="space-y-4">
                            <h2 className="text-accent font-bold uppercase tracking-widest text-sm">Stay Updated</h2>
                            <h3 className="text-4xl md:text-5xl font-bold text-white leading-tight">Hear about the <span className="text-accent italic">next life we save.</span></h3>
                            <p className="text-slate-300 text-lg max-w-2xl mx-auto">
                                Join our monthly newsletter to receive verified impact reports and hear stories of hope from directly within Nigerian communities.
                            </p>
                        </div>
                        <form className="flex flex-col md:flex-row gap-4 max-w-2xl mx-auto">
                            <input
                                type="email"
                                placeholder="Your email address"
                                className="flex-1 h-16 bg-white/10 border border-white/10 rounded-2xl px-8 text-white focus:outline-none focus:ring-2 focus:ring-accent/50 placeholder:text-slate-500"
                            />
                            <button type="submit" className="btn-primary bg-accent text-primary hover:bg-white h-16 px-10 border-none font-bold">
                                Join the Movement
                            </button>
                        </form>
                        <p className="text-slate-400 text-xs font-medium">No spam. Only stories of hope and transparency. Unsubscribe anytime.</p>
                    </div>
                </div>
            </section>

            {/* About CTA */}
            <section id="about" className="py-24 bg-secondary/30">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="bg-white rounded-[4rem] p-12 md:p-20 shadow-xl border border-slate-100 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-accent/10 rounded-full -mr-32 -mt-32 blur-3xl" />
                        <div className="flex flex-col lg:flex-row gap-12 items-center relative z-10">
                            <div className="lg:w-1/2 space-y-6">
                                <h2 className="text-4xl md:text-5xl font-bold text-primary leading-tight">Join the initiative <br /><span className="text-accent underline">impact Nigeria today.</span></h2>
                                <p className="text-slate-600 text-lg leading-relaxed">
                                    Every contribution, no matter how small, brings us closer to a healthier and safer Nigeria. Your donation is a bridge of hope for someone in need.
                                </p>
                                <div className="flex flex-wrap gap-4 pt-4">
                                    <Link to="/cases" className="btn-primary px-10 h-16 flex items-center">Become a Donor</Link>
                                    <Link to="/partner" className="btn-outline px-10 h-16 flex items-center border-slate-200">Partner with Us</Link>
                                </div>
                            </div>
                            <div className="lg:w-1/2">
                                <div className="grid grid-cols-2 gap-4">
                                    <img src="/assets/images/hospital_bed_child.png" className="rounded-[2.5rem] h-64 w-full object-cover mt-12 shadow-2xl" alt="Nigerian Child Hospital Appeal" />
                                    <img src="/assets/images/children_community.png" className="rounded-[2.5rem] h-64 w-full object-cover shadow-2xl" alt="Real Nigerian Children in Need" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
