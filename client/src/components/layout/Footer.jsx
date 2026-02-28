import { Link } from 'react-router-dom';
import { Heart, Mail, Phone, MapPin, Instagram, Facebook, Twitter } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-primary text-white pt-20 pb-10">
            <div className="container mx-auto px-4 md:px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                    {/* Brand */}
                    <div className="space-y-6">
                        <Link to="/" className="flex items-center gap-2">
                            <div className="bg-white/10 p-2 rounded-lg">
                                <Heart className="text-accent" size={24} fill="currentColor" />
                            </div>
                            <span className="font-display font-bold text-2xl tracking-tight">
                                Bridge of<span className="text-accent ml-1">Impact</span>
                            </span>
                        </Link>
                        <p className="text-slate-300 leading-relaxed">
                            Restoring hope and saving lives through transparent, verified fundraising cases across Nigeria. Join us in making a real difference.
                        </p>
                        <div className="flex gap-4">
                            <a href="#" className="bg-white/5 p-2 rounded-full hover:bg-accent hover:text-primary transition-all">
                                <Instagram size={20} />
                            </a>
                            <a href="#" className="bg-white/5 p-2 rounded-full hover:bg-accent hover:text-primary transition-all">
                                <Facebook size={20} />
                            </a>
                            <a href="#" className="bg-white/5 p-2 rounded-full hover:bg-accent hover:text-primary transition-all">
                                <Twitter size={20} />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="font-display font-bold text-lg mb-6 text-accent">Quick Links</h4>
                        <ul className="space-y-4">
                            <li><Link to="/" className="text-slate-300 hover:text-white transition-colors">Home</Link></li>
                            <li><Link to="/cases" className="text-slate-300 hover:text-white transition-colors">Active Cases</Link></li>
                            <li><Link to="/#about" className="text-slate-300 hover:text-white transition-colors">About Mission</Link></li>
                            <li><Link to="/#how-it-works" className="text-slate-300 hover:text-white transition-colors">How It Works</Link></li>
                            <li><Link to="/partner" className="text-slate-300 hover:text-white transition-colors">Partner with Us</Link></li>
                        </ul>
                    </div>

                    {/* Support */}
                    <div>
                        <h4 className="font-display font-bold text-lg mb-6 text-accent">Verification</h4>
                        <ul className="space-y-4">
                            <li className="text-slate-300">Verified by CAC</li>
                            <li className="text-slate-400 text-sm">RC: 1234567 (Placeholder)</li>
                            <li><Link to="/admin" className="text-slate-400 hover:text-white text-sm">Admin Portal</Link></li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="font-display font-bold text-lg mb-6 text-accent">Contact Nigeria</h4>
                        <ul className="space-y-4">
                            <li className="flex gap-3 text-slate-300">
                                <MapPin className="text-accent shrink-0" size={20} />
                                <span>123 Victoria Island, Lagos, Nigeria</span>
                            </li>
                            <li className="flex gap-3 text-slate-300">
                                <Phone className="text-accent shrink-0" size={20} />
                                <span>+234 800 IMPACT NGO</span>
                            </li>
                            <li className="flex gap-3 text-slate-300">
                                <Mail className="text-accent shrink-0" size={20} />
                                <span>contact@bridgeofimpact.org</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-slate-400 text-sm">
                    <p>© {new Date().getFullYear()} Bridge of Impact Initiative. All Rights Reserved.</p>
                    <div className="flex gap-6">
                        <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                        <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
