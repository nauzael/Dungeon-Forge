
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { Character } from '../types';
import { getFinalStats } from '../utils/sheetUtils';

interface Message {
    role: 'user' | 'model';
    text: string;
}

interface AiAssistantProps {
    character: Character;
}

const AiAssistant: React.FC<AiAssistantProps> = ({ character }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        { role: 'model', text: `Greetings, adventurer! I'm analyzing **${character.name}**, your **${character.class}** of level **${character.level}**. Do you need help with the 2024 edition rules or ideas for your next roleplay?` }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, loading]);

    const handleSend = async () => {
        if (!input.trim() || loading) return;

        const userMsg = input.trim();
        setInput('');
        setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
        setLoading(true);

        try {
            const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_API_KEY });
            const stats = getFinalStats(character);
            
            const systemInstruction = `You are an expert Dungeon Master and D&D 2024 Edition assistant. 
            You are helping a player with their current character:
            - Name: ${character.name}
            - Class: ${character.class} (${character.subclass || 'No subclass yet'})
            - Level: ${character.level}
            - Species: ${character.species}
            - Attributes: STR:${stats.STR}, DEX:${stats.DEX}, CON:${stats.CON}, INT:${stats.INT}, WIS:${stats.WIS}, CHA:${stats.CHA}
            - Trained Skills: ${character.skills.join(', ')}
            - Background: ${character.background}
            
            Important rules:
            1. Be concise but immersive.
            2. Use 2024 version terminology (e.g. 'Use action', 'Weapon Mastery', 'Heroic Inspiration').
            3. If the player asks about roleplay, give options that fit their class and background.`;

            const response = await ai.models.generateContent({
                model: 'gemini-3-pro-preview',
                contents: userMsg,
                config: {
                    systemInstruction: systemInstruction,
                    temperature: 0.8,
                }
            });

            const resultText = (response as any)?.text ?? (response as any)?.response?.text ?? '';
            if (resultText) {
                setMessages(prev => [...prev, { role: 'model', text: resultText.trim() }]);
            }
        } catch (e) {
            console.error("AI Error:", e);
            setMessages(prev => [...prev, { role: 'model', text: "Sorry, my connection to the Astral Plane has weakened. Please verify that the API key is correct." }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <button 
                onClick={() => setIsOpen(true)}
                className="fixed bottom-24 right-4 z-50 size-14 rounded-full bg-gradient-to-tr from-purple-600 to-primary text-white shadow-xl shadow-purple-500/20 flex items-center justify-center hover:scale-110 active:scale-95 transition-all"
            >
                <span className="material-symbols-outlined text-3xl">auto_awesome</span>
            </button>

            {isOpen && (
                <div className="fixed inset-0 z-[100] flex flex-col bg-background-dark/90 backdrop-blur-sm animate-fadeIn">
                    <div className="mt-auto w-full max-w-md mx-auto bg-white dark:bg-surface-dark rounded-t-3xl shadow-2xl flex flex-col h-[85vh] border-x border-t border-white/10 animate-scaleUp">
                        <div className="p-4 border-b border-white/5 flex items-center justify-between bg-slate-50 dark:bg-black/20 rounded-t-3xl">
                            <div className="flex items-center gap-3">
                                <div className="size-10 rounded-xl bg-purple-500/20 flex items-center justify-center text-purple-400">
                                    <span className="material-symbols-outlined">psychology</span>
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-900 dark:text-white">Gemini Oracle</h3>
                                    <p className="text-[10px] font-black text-primary uppercase tracking-widest">DM Assistant</p>
                                </div>
                            </div>
                            <button onClick={() => setIsOpen(false)} className="size-10 rounded-full hover:bg-white/5 flex items-center justify-center text-slate-400">
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>

                        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
                            {messages.map((msg, i) => (
                                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[85%] p-3.5 rounded-2xl text-sm leading-relaxed ${
                                        msg.role === 'user' 
                                            ? 'bg-primary text-background-dark font-bold rounded-tr-none' 
                                            : 'bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-slate-200 rounded-tl-none border border-slate-200 dark:border-white/5'
                                    }`}>
                                        {msg.text}
                                    </div>
                                </div>
                            ))}
                            {loading && (
                                <div className="flex justify-start">
                                    <div className="bg-slate-100 dark:bg-white/5 p-4 rounded-2xl rounded-tl-none animate-pulse">
                                        <div className="flex gap-1.5">
                                            <div className="size-1.5 rounded-full bg-primary/50 animate-bounce"></div>
                                            <div className="size-1.5 rounded-full bg-primary/50 animate-bounce [animation-delay:0.2s]"></div>
                                            <div className="size-1.5 rounded-full bg-primary/50 animate-bounce [animation-delay:0.4s]"></div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="p-4 border-t border-white/5 bg-slate-50 dark:bg-black/10">
                            <div className="flex gap-2 bg-white dark:bg-surface-dark p-2 rounded-2xl border border-slate-200 dark:border-white/10 shadow-inner">
                                <input 
                                    type="text" 
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                    placeholder="Ask about your character or rules..."
                                    className="flex-1 bg-transparent border-none focus:ring-0 text-sm py-2 px-1 dark:text-white placeholder:text-slate-500"
                                />
                                <button 
                                    onClick={handleSend}
                                    disabled={!input.trim() || loading}
                                    className="size-10 rounded-xl bg-primary text-background-dark flex items-center justify-center shadow-lg shadow-primary/20 disabled:opacity-50 transition-all active:scale-90"
                                >
                                    <span className="material-symbols-outlined font-black">send</span>
                                </button>
                            </div>
                            <p className="text-[8px] text-center text-slate-500 mt-3 uppercase tracking-tighter opacity-50">
                                Powered by Gemini 3 Pro • D&D 2024 Knowledge
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default AiAssistant;
