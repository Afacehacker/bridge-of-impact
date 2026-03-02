import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ChevronRight, ShieldCheck, CreditCard, Users, Heart } from 'lucide-react';

const Hero = () => {
    const [recentDonation, setRecentDonation] = useState({ name: 'Anonymous', amount: '50,000' });

    useEffect(() => {
        const donors = ['Anonymous', 'Tunde A.', 'Mrs. Okon', 'Chidi K.', 'Anonymous', 'Dr. Sola', 'Fatimah Z.', 'Anonymous', 'Ibrahim M.'];
        const amounts = ['5,000', '10,000', '25,000', '50,000', '100,000', '15,000', '20,000', '30,000'];
        const FIVE_MINUTES = 5 * 60 * 1000;

        const stored = localStorage.getItem('recent_donation_surge');
        const now = Date.now();

        if (stored) {
            const { data, timestamp } = JSON.parse(stored);

            if (now - timestamp < FIVE_MINUTES) {
                const randomDonor = donors[Math.floor(Math.random() * donors.length)];
                const randomAmount = amounts[Math.floor(Math.random() * amounts.length)];
                const newData = { name: randomDonor, amount: randomAmount };
                setRecentDonation(newData);
                localStorage.setItem('recent_donation_surge', JSON.stringify({ data: newData, timestamp: now }));
            } else {
                setRecentDonation(data);
                localStorage.setItem('recent_donation_surge', JSON.stringify({ data, timestamp: now }));
            }
        } else {
            const randomDonor = donors[Math.floor(Math.random() * donors.length)];
            const randomAmount = amounts[Math.floor(Math.random() * amounts.length)];
            const newData = { name: randomDonor, amount: randomAmount };
            setRecentDonation(newData);
            localStorage.setItem('recent_donation_surge', JSON.stringify({ data: newData, timestamp: now }));
        }
    }, []);

    return (
        <section className="relative min-h-[90vh] flex items-center pt-20 overflow-hidden">
            {/* Background Orbs */}
            <div className="absolute top-[-10%] right-[-5%] w-[40rem] h-[40rem] bg-primary/20 rounded-full blur-[120px] -z-10 animate-pulse" />
            <div className="absolute bottom-[-10%] left-[-5%] w-[30rem] h-[30rem] bg-accent/10 rounded-full blur-[100px] -z-10" />

            <div className="container mx-auto px-4 md:px-6">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        className="space-y-8"
                    >
                        <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full font-semibold text-sm">
                            <span className="w-2 h-2 bg-primary rounded-full animate-ping" />
                            Verified NGO in Nigeria
                        </div>

                        <h1 className="text-4xl md:text-7xl font-bold text-primary leading-[1.1] tracking-tight">
                            Restoring Hope. <br />
                            <span className="text-accent underline decoration-primary/20">Saving Lives.</span> <br />
                            One Donation at a Time.
                        </h1>

                        <p className="text-lg md:text-xl text-slate-600 max-w-xl leading-relaxed">
                            Bridge of Impact Initiative connects generous hearts to verified medical emergencies and crisis relief needs across Nigeria. Join us in making an impact that lasts.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <Link to="/cases" className="btn-primary text-base md:text-lg h-14 px-8">
                                Donate Now
                                <ChevronRight className="ml-2" size={20} />
                            </Link>
                            <Link to="/how-it-works" className="btn-outline text-base md:text-lg h-14 px-8">
                                View Our Process
                            </Link>
                        </div>

                        <div className="flex flex-wrap gap-4 md:gap-8 pt-6">
                            {[
                                { icon: <ShieldCheck className="text-primary" />, label: '100% Verified' },
                                { icon: <CreditCard className="text-primary" />, label: 'Paystack Secured' },
                                { icon: <Users className="text-primary" />, label: 'Direct Impact' },
                            ].map((item, i) => (
                                <div key={i} className="flex items-center gap-2 text-xs md:text-sm font-semibold text-slate-700">
                                    <div className="bg-white p-1.5 md:p-2 rounded-lg shadow-sm border border-slate-100">
                                        {item.icon}
                                    </div>
                                    {item.label}
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="relative mt-8 lg:mt-0"
                    >
                        <div className="relative z-10 rounded-[2rem] md:rounded-[2.5rem] overflow-hidden shadow-2xl border-4 md:border-8 border-white">
                            <img
                                src="/assets/images/regina_appeal.png"
                                alt="Authentic Nigerian Medical Appeal"
                                className="w-full h-full object-cover aspect-[4/5] hover:scale-105 transition-transform duration-700"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-primary/60 to-transparent" />
                            <div className="absolute bottom-4 left-4 right-4 md:bottom-8 md:left-8 md:right-8 glass p-4 md:p-6 rounded-2xl border border-white/30">
                                <div className="flex justify-between items-end">
                                    <div>
                                        <h4 className="font-bold text-white text-base md:text-lg">Ongoing Kidney Surgery</h4>
                                        <p className="text-white/80 text-xs md:text-sm">Lagos State University Hospital</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-accent font-bold text-lg md:text-xl">₦2.4M</p>
                                        <p className="text-white/60 text-[10px] md:text-xs">Target Met: 85%</p>
                                    </div>
                                </div>
                                <div className="w-full bg-white/20 h-1.5 md:h-2 rounded-full mt-3 md:mt-4 overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: '85%' }}
                                        transition={{ duration: 1.5, delay: 0.5 }}
                                        className="bg-accent h-full"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Floating Element */}
                        <motion.div
                            animate={{ y: [0, -10, 0] }}
                            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                            className="absolute -top-4 -right-2 md:-top-6 md:-right-6 lg:-right-12 glass p-3 md:p-4 rounded-xl md:rounded-2xl shadow-xl border border-white/50 z-20"
                        >
                            <div className="flex items-center gap-2 md:gap-3">
                                <div className="bg-primary p-1.5 md:p-2 rounded-full">
                                    <Heart fill="#fbbf24" className="text-accent" size={16} />
                                </div>
                                <div>
                                    <p className="text-[10px] md:text-xs text-slate-500 font-medium">Recently Donated</p>
                                    <p className="text-xs md:text-sm font-bold text-primary">{recentDonation.name}: ₦{recentDonation.amount}</p>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
