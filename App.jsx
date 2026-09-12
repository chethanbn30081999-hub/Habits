import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Plus, X, CheckCircle } from 'lucide-react';

export default function App() {
    const [habits, setHabits] = useState(() => JSON.parse(localStorage.getItem('habits')) || []);
    const [logs, setLogs] = useState(() => JSON.parse(localStorage.getItem('logs')) || []);
    const [isHabitModalOpen, setIsHabitModalOpen] = useState(false);
    const [newHabitName, setNewHabitName] = useState('');
    const [newHabitType, setNewHabitType] = useState('towards');
    const [selectedHabit, setSelectedHabit] = useState(null);

    const [entryType, setEntryType] = useState('action');
    const [craving, setCraving] = useState(0);
    const [predicted, setPredicted] = useState(0);
    const [immediate, setImmediate] = useState(0);
    const [after5, setAfter5] = useState(0);
    const [trigger, setTrigger] = useState('');
    const [notes, setNotes] = useState('');
    const [rewardNote, setRewardNote] = useState('');
    const [confidence, setConfidence] = useState(0);

    useEffect(() => {
        localStorage.setItem('habits', JSON.stringify(habits));
        localStorage.setItem('logs', JSON.stringify(logs));
    }, [habits, logs]);

    const handleAddHabit = () => {
        if (!newHabitName.trim()) return;
        setHabits([...habits, { id: Date.now().toString(), name: newHabitName, type: newHabitType }]);
        setNewHabitName('');
        setIsHabitModalOpen(false);
    };

    const handleSaveEntry = () => {
        const newLog = {
            id: Date.now().toString(),
            habitId: selectedHabit.id,
            date: new Date().toISOString(),
            type: entryType,
            craving: Number(craving),
            predicted: Number(predicted),
            immediate: Number(immediate),
            after5: Number(after5),
            trigger,
            notes,
            rewardNote,
            confidence: Number(confidence)
        };
        setLogs([...logs, newLog]);
        setCraving(0); setPredicted(0); setImmediate(0); setAfter5(0);
        setTrigger(''); setNotes(''); setRewardNote(''); setConfidence(0);
    };

    const habitLogs = logs.filter(l => selectedHabit && l.habitId === selectedHabit.id);
    const chartData = habitLogs.map(l => ({ ...l, time: new Date(l.date).toLocaleDateString() + ' ' + new Date(l.date).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'}) }));

    return (
        <div className="min-h-screen bg-gray-900 text-white p-6">
            <header className="mb-8 flex justify-between items-center max-w-5xl mx-auto">
                <h1 className="text-3xl font-bold">Behavior Tracker</h1>
                <button onClick={() => setIsHabitModalOpen(true)} className="bg-blue-600 px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700">
                    <Plus size={18} /> Add Habit
                </button>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
                <div className="bg-gray-800 p-6 rounded-xl border-t-4 border-emerald-500">
                    <h2 className="text-xl font-semibold mb-4 text-emerald-400">Towards (Positive) Habits</h2>
                    <div className="space-y-3">
                        {habits.filter(h => h.type === 'towards').map(h => (
                            <button key={h.id} onClick={() => setSelectedHabit(h)} className="w-full text-left p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition shadow">
                                {h.name}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="bg-gray-800 p-6 rounded-xl border-t-4 border-rose-500">
                    <h2 className="text-xl font-semibold mb-4 text-rose-400">Away (Negative) Habits</h2>
                    <div className="space-y-3">
                        {habits.filter(h => h.type === 'away').map(h => (
                            <button key={h.id} onClick={() => setSelectedHabit(h)} className="w-full text-left p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition shadow">
                                {h.name}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {isHabitModalOpen && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
                    <div className="bg-gray-800 p-6 rounded-xl w-full max-w-md shadow-2xl border border-gray-700">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold">New Habit</h2>
                            <button onClick={() => setIsHabitModalOpen(false)}><X size={20} /></button>
                        </div>
                        <input value={newHabitName} onChange={e => setNewHabitName(e.target.value)} placeholder="Habit Name" className="w-full bg-gray-700 p-3 rounded mb-4 focus:ring-2 focus:ring-blue-500 outline-none" />
                        <select value={newHabitType} onChange={e => setNewHabitType(e.target.value)} className="w-full bg-gray-700 p-3 rounded mb-4 outline-none">
                            <option value="towards">Towards (Positive)</option>
                            <option value="away">Away (Negative)</option>
                        </select>
                        <button onClick={handleAddHabit} className="w-full bg-blue-600 py-3 rounded font-bold hover:bg-blue-700 transition">Create</button>
                    </div>
                </div>
            )}

            {selectedHabit && (
                <div className="fixed inset-0 bg-black/80 overflow-y-auto p-4 z-50">
                    <div className="max-w-5xl mx-auto bg-gray-900 min-h-screen p-6 rounded-xl border border-gray-700 mt-10 mb-10 shadow-2xl">
                        <div className="flex justify-between items-center mb-6 border-b border-gray-800 pb-4">
                            <h2 className="text-2xl font-bold flex items-center gap-3">
                                {selectedHabit.name} <span className={`text-xs px-3 py-1 rounded-full ${selectedHabit.type === 'towards' ? 'bg-emerald-900/50 text-emerald-400 border border-emerald-700' : 'bg-rose-900/50 text-rose-400 border border-rose-700'}`}>{selectedHabit.type.toUpperCase()}</span>
                            </h2>
                            <button onClick={() => setSelectedHabit(null)} className="p-2 bg-gray-800 rounded-full hover:bg-gray-700 transition"><X size={24} /></button>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <div>
                                <div className="flex gap-2 mb-6 bg-gray-800 p-1 rounded-lg">
                                    <button onClick={() => setEntryType('action')} className={`flex-1 py-2 rounded-md font-semibold transition ${entryType === 'action' ? 'bg-blue-600 shadow' : 'hover:bg-gray-700'}`}>Log Action</button>
                                    <button onClick={() => setEntryType('pass')} className={`flex-1 py-2 rounded-md font-semibold flex items-center justify-center gap-2 transition ${entryType === 'pass' ? 'bg-purple-600 shadow' : 'hover:bg-gray-700'}`}><CheckCircle size={18}/> Log Pass</button>
                                </div>

                                {entryType === 'action' ? (
                                    <div className="space-y-4 bg-gray-800 p-6 rounded-xl shadow-inner border border-gray-700">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div><label className="text-sm text-gray-400 block mb-1">Craving (-10 to 10)</label><input type="number" value={craving} onChange={e=>setCraving(e.target.value)} className="w-full bg-gray-900 border border-gray-700 p-2 rounded outline-none focus:border-blue-500" /></div>
                                            <div><label className="text-sm text-gray-400 block mb-1">Predicted Reward</label><input type="number" value={predicted} onChange={e=>setPredicted(e.target.value)} className="w-full bg-gray-900 border border-gray-700 p-2 rounded outline-none focus:border-blue-500" /></div>
                                            <div><label className="text-sm text-gray-400 block mb-1">Immediate Reward</label><input type="number" value={immediate} onChange={e=>setImmediate(e.target.value)} className="w-full bg-gray-900 border border-gray-700 p-2 rounded outline-none focus:border-blue-500" /></div>
                                            <div><label className="text-sm text-gray-400 block mb-1">After 5 Min Reward</label><input type="number" value={after5} onChange={e=>setAfter5(e.target.value)} className="w-full bg-gray-900 border border-gray-700 p-2 rounded outline-none focus:border-blue-500" /></div>
                                        </div>
                                        <div><label className="text-sm text-gray-400 block mb-1">Trigger / Cue</label><input value={trigger} onChange={e=>setTrigger(e.target.value)} className="w-full bg-gray-900 border border-gray-700 p-2 rounded outline-none focus:border-blue-500" placeholder="What sparked it?" /></div>
                                        <div><label className="text-sm text-gray-400 block mb-1">Reward Note</label><input value={rewardNote} onChange={e=>setRewardNote(e.target.value)} className="w-full bg-gray-900 border border-yellow-700/50 p-2 rounded outline-none focus:border-yellow-500" placeholder="e.g., Felt relaxed" /></div>
                                        <div><label className="text-sm text-gray-400 block mb-1">Behavior Notes</label><textarea value={notes} onChange={e=>setNotes(e.target.value)} className="w-full bg-gray-900 border border-gray-700 p-2 rounded h-20 outline-none focus:border-blue-500" placeholder="Additional details..." /></div>
                                    </div>
                                ) : (
                                    <div className="space-y-4 bg-gray-800 p-6 rounded-xl shadow-inner border border-purple-500/30">
                                        <div><label className="text-sm text-gray-400 block mb-1">Confidence Score (1-10)</label><input type="number" min="1" max="10" value={confidence} onChange={e=>setConfidence(e.target.value)} className="w-full bg-gray-900 border border-gray-700 p-3 rounded text-xl outline-none focus:border-purple-500" /></div>
                                        <div><label className="text-sm text-gray-400 block mb-1">Notes on Pass</label><textarea value={notes} onChange={e=>setNotes(e.target.value)} className="w-full bg-gray-900 border border-gray-700 p-2 rounded h-24 outline-none focus:border-purple-500" placeholder="How did you successfully pass or manage the craving?" /></div>
                                    </div>
                                )}
                                <button onClick={handleSaveEntry} className={`w-full mt-6 py-3 rounded-xl font-bold text-lg transition shadow-lg ${entryType === 'action' ? 'bg-blue-600 hover:bg-blue-500' : 'bg-purple-600 hover:bg-purple-500'}`}>Save Entry</button>
                            </div>

                            <div className="space-y-6">
                                <div className="bg-gray-800 p-5 rounded-xl border border-gray-700 h-72">
                                    <h3 className="text-sm font-semibold mb-4 text-gray-400">Trend & Confidence</h3>
                                    <ResponsiveContainer width="100%" height="100%">
                                        <LineChart data={chartData}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                                            <XAxis dataKey="time" stroke="#9CA3AF" fontSize={11} tick={{fill: '#9CA3AF'}} />
                                            <YAxis domain={[-10, 10]} stroke="#9CA3AF" fontSize={11} tick={{fill: '#9CA3AF'}} />
                                            <Tooltip contentStyle={{backgroundColor: '#1F2937', borderColor: '#374151', color: '#fff'}} />
                                            <Legend wrapperStyle={{fontSize: '12px'}} />
                                            <Line type="monotone" dataKey="craving" stroke="#3B82F6" strokeWidth={2} dot={{r: 4}} name="Craving" connectNulls />
                                            <Line type="monotone" dataKey="after5" stroke="#8B5CF6" strokeWidth={2} dot={{r: 4}} name="After 5m" connectNulls />
                                            <Line type="step" dataKey="confidence" stroke="#10B981" strokeWidth={2} strokeDasharray="5 5" dot={{r: 5, fill: '#10B981'}} name="Confidence" connectNulls />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </div>

                                <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 flex flex-col items-center justify-center relative overflow-hidden">
                                    <h3 className="text-sm font-semibold mb-6 text-gray-400 w-full text-left">Behavior Loop (Latest Action)</h3>
                                    {habitLogs.filter(l => l.type === 'action').length > 0 ? (() => {
                                        const last = habitLogs.filter(l => l.type === 'action').pop();
                                        return (
                                            <div className="relative w-64 h-64 my-4">
                                                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-24 bg-gray-900 rounded-full flex flex-col items-center justify-center border-2 border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.3)] p-2 text-center text-xs z-10">
                                                    <span className="font-bold text-blue-400 mb-1">Trigger</span>
                                                    <span className="text-gray-300 truncate w-full">{last.trigger || '...'}</span>
                                                </div>
                                                <div className="absolute bottom-2 right-0 w-24 h-24 bg-gray-900 rounded-full flex flex-col items-center justify-center border-2 border-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.3)] p-2 text-center text-xs z-10">
                                                    <span className="font-bold text-rose-400 mb-1">Behavior</span>
                                                    <span className="text-gray-300 truncate w-full">{selectedHabit.name}</span>
                                                </div>
                                                <div className="absolute bottom-2 left-0 w-24 h-24 bg-gray-900 rounded-full flex flex-col items-center justify-center border-2 border-yellow-500 shadow-[0_0_15px_rgba(234,179,8,0.3)] p-2 text-center text-xs z-10">
                                                    <span className="font-bold text-yellow-400 mb-1">Reward</span>
                                                    <span className="text-gray-300 truncate w-full">{last.rewardNote || '...'}</span>
                                                </div>
                                                <svg className="absolute inset-0 w-full h-full text-gray-600" style={{pointerEvents: 'none'}}>
                                                    <path d="M 140 40 Q 200 60 210 130" fill="none" stroke="currentColor" strokeWidth="3" strokeDasharray="6 4" markerEnd="url(#arrow)" />
                                                    <path d="M 180 200 Q 128 220 80 200" fill="none" stroke="currentColor" strokeWidth="3" strokeDasharray="6 4" markerEnd="url(#arrow)" />
                                                    <path d="M 60 130 Q 80 60 120 40" fill="none" stroke="currentColor" strokeWidth="3" strokeDasharray="6 4" markerEnd="url(#arrow)" />
                                                    <defs>
                                                        <marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                                                            <path d="M 0 0 L 10 5 L 0 10 z" fill="currentColor" />
                                                        </marker>
                                                    </defs>
                                                </svg>
                                            </div>
                                        )
                                    })() : (
                                        <div className="text-gray-500 italic py-12">Log an action to see the behavior loop.</div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
