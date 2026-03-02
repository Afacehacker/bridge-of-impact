import { motion } from 'framer-motion';
import { ShieldCheck, HeartPulse, Lock, CheckCircle2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const HowItWorks = () => {
    return (
        <div className="pt-24 min-h-screen">
            {/* Header section */}
            <section className="py-20 bg-primary text-white relative overflow-hidden">
                <div className="absolute top-[-10%] right-[-5%] w-[30rem] h-[30rem] bg-accent/20 rounded-full blur-[100px] -z-0" />
                <div className="container mx-auto px-4 md:px-6 relative z-10 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="max-w-3xl mx-auto space-y-6"
                    >
                        <h1 className="text-4xl md:text-6xl font-bold font-display italic">How It Works</h1>
                        <p className="text-xl text-slate-300">
                            Our rigorous verification and direct-impact process ensures your generosity transforms lives across Nigeria with 100% transparency.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Steps section */}
            <section className="py-24 bg-white relative overflow-hidden">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
                        {[
                            {
                                icon: <ShieldCheck size={40} />,
                                title: "1. Verified Needs",
                                desc: "Every case on our platform is personally vetted. We visit hospitals, verify CAC registrations of partners, and validate medical reports to ensure authenticity.",
                                details: [
                                    "Direct hospital visits",
                                    "Medical report verification",
                                    "Identity validation",
                                    "Background checks"
                                ]
                            },
                            {
                                icon: <HeartPulse size={40} />,
                                title: "2. Transparent Appeal",
                                desc: "No anonymous or vague requests. We publish detailed stories with clear financial targets, so you know exactly where your money is going.",
                                details: [
                                    "Detailed cost breakdowns",
                                    "Clear impact goals",
                                    "Regular updates",
                                    "Verified beneficiaries"
                                ]
                            },
                            {
                                icon: <Lock size={40} />,
                                title: "3. Direct Impact",
                                desc: "Donations are processed via Paystack. Funds are never paid to personal accounts but directly to hospitals, pharmacies, or service providers.",
                                details: [
                                    "Paystack secured",
                                    "Zero intermediary diversion",
                                    "Direct provider payment",
                                    "Audit trails"
                                ]
                            },
                            {
                                icon: <CheckCircle2 size={40} />,
                                title: "4. Proof of Life",
                                desc: "Transparency doesn't end with payment. We provide follow-up reports and 'Proof of Life' updates to show you the result of your kindness.",
                                details: [
                                    "Post-surgery reports",
                                    "Recovery updates",
                                    "Fund utilization logs",
                                    "Beneficiary video notes"
                                ]
                            }
                        ].map((step, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1, duration: 0.8 }}
                                className="p-8 rounded-[2.5rem] bg-secondary/10 border border-slate-100 hover:shadow-xl transition-all duration-300 space-y-6"
                            >
                                <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                                    {step.icon}
                                </div>
                                <h3 className="text-2xl font-bold text-primary">{step.title}</h3>
                                <p className="text-slate-600 text-sm leading-relaxed">{step.desc}</p>
                                <ul className="space-y-2 pt-4 border-t border-slate-200">
                                    {step.details.map((detail, idx) => (
                                        <li key={idx} className="flex items-center gap-2 text-xs font-semibold text-primary">
                                            <ArrowRight size={14} className="text-accent" />
                                            {detail}
                                        </li>
                                    ))}
                                </ul>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 bg-secondary/20">
                <div className="container mx-auto px-4 text-center space-y-8">
                    <h2 className="text-3xl md:text-5xl font-bold text-primary leading-tight">Ready to make an <br /><span className="text-accent underline">impact that lasts?</span></h2>
                    <div className="flex justify-center gap-4">
                        <Link to="/cases" className="btn-primary px-10 h-16 flex items-center">Explore Active Cases</Link>
                        <Link to="/partner" className="btn-outline px-10 h-16 flex items-center border-slate-200">Partner with Us</Link>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default HowItWorks;
