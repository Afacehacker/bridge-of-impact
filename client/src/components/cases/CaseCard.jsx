import { motion } from 'framer-motion';
import { MapPin, Users, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getImageUrl } from '../../services/api';

const CaseCard = ({ caseData }) => {
    const {
        _id,
        title,
        location,
        image,
        targetAmount,
        amountRaised,
        beneficiaryName,
        category
    } = caseData;

    const percentage = Math.min(Math.round((amountRaised / targetAmount) * 100), 100);
    const remaining = targetAmount - amountRaised;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-[2rem] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 group"
        >
            <div className="relative h-64 overflow-hidden">
                <img
                    src={getImageUrl(image)}
                    alt={title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4">
                    <span className="bg-primary/90 backdrop-blur-md text-white px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
                        {category}
                    </span>
                </div>
            </div>

            <div className="p-6 md:p-8 space-y-5 md:space-y-6">
                <div className="space-y-2">
                    <div className="flex items-center gap-2 text-slate-500 text-[11px] md:text-sm">
                        <MapPin size={14} md:size={16} className="text-primary" />
                        <span>{location}, Nigeria</span>
                    </div>
                    <h3 className="text-xl md:text-2xl font-bold text-primary leading-tight group-hover:text-primary-light transition-colors">
                        {title}
                    </h3>
                    <p className="text-slate-500 text-xs md:text-sm">Targeting: <span className="font-semibold text-slate-800">{beneficiaryName}</span></p>
                </div>

                <div className="space-y-4">
                    <div className="flex justify-between items-end">
                        <div>
                            <p className="text-xs text-slate-400 font-medium uppercase tracking-tighter">Raised</p>
                            <p className="text-xl font-bold text-primary">₦{amountRaised.toLocaleString()}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-xs text-slate-400 font-medium uppercase tracking-tighter">Goal</p>
                            <p className="text-xl font-bold text-slate-400 group-hover:text-accent transition-colors">₦{targetAmount.toLocaleString()}</p>
                        </div>
                    </div>

                    <div className="relative w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                        <motion.div
                            initial={{ width: 0 }}
                            whileInView={{ width: `${percentage}%` }}
                            viewport={{ once: true }}
                            transition={{ duration: 1, ease: 'easeOut' }}
                            className="absolute top-0 left-0 h-full bg-primary rounded-full"
                        />
                    </div>

                    <div className="flex justify-between items-center text-xs font-bold text-slate-500 uppercase tracking-widest">
                        <span>{percentage}% Reached</span>
                        <span>₦{remaining.toLocaleString()} left</span>
                    </div>
                </div>

                <Link
                    to={`/cases/${_id}`}
                    className="flex items-center justify-between w-full btn-primary group/btn h-14"
                >
                    <span>Donate Now</span>
                    <div className="bg-white/20 p-2 rounded-full group-hover/btn:translate-x-1 transition-transform">
                        <ArrowRight size={18} />
                    </div>
                </Link>
            </div>
        </motion.div>
    );
};

export default CaseCard;
