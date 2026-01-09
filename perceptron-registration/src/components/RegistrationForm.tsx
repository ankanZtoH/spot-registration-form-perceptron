'use client';

import React, { useState } from 'react';
import { INITIAL_EVENTS, Event } from '@/data/events';
import { Check, User, Mail, Phone, Calendar } from 'lucide-react';

export default function RegistrationForm() {
    const [events, setEvents] = useState<Event[]>(INITIAL_EVENTS);
    const [selectedDay, setSelectedDay] = useState<'Day 1' | 'Day 2'>('Day 1');
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
    });
    const [selectedEvents, setSelectedEvents] = useState<string[]>([]);
    const [errors, setErrors] = useState({
        name: '',
        phone: '',
        email: '',
        events: ''
    });
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    const filteredEvents = events.filter((e) => e.day === selectedDay);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        // Clear error when user types
        if (errors[name as keyof typeof errors]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const toggleEvent = (eventId: string) => {
        setSelectedEvents((prev) => {
            const newSelection = prev.includes(eventId)
                ? prev.filter((id) => id !== eventId)
                : [...prev, eventId];

            if (newSelection.length > 0 && errors.events) {
                setErrors(prev => ({ ...prev, events: '' }));
            }
            return newSelection;
        });
    };

    const validateForm = () => {
        let isValid = true;
        const newErrors = { name: '', phone: '', email: '', events: '' };

        if (!formData.name.trim()) {
            newErrors.name = 'Name is required';
            isValid = false;
        }
        if (!formData.phone.trim()) {
            newErrors.phone = 'Phone number is required';
            isValid = false;
        } else if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, ''))) {
            // Simple 10-digit validation logic, customized as needed
            newErrors.phone = 'Enter a valid 10-digit phone number';
            isValid = false;
        }
        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
            isValid = false;
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Enter a valid email address';
            isValid = false;
        }
        if (selectedEvents.length === 0) {
            newErrors.events = 'Select at least one event';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleInitialSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validateForm()) {
            setShowConfirmation(true);
        }
    };

    // const confirmRegistration = () => {
    //     // Update event counts based on selection
    //     setEvents(prevEvents => prevEvents.map(event => {
    //         if (selectedEvents.includes(event.id)) {
    //             const isFull = event.registeredCount >= event.totalSpots;
    //             return {
    //                 ...event,
    //                 registeredCount: isFull ? event.registeredCount : event.registeredCount + 1,
    //                 extraRegistrations: isFull ? event.extraRegistrations + 1 : event.extraRegistrations
    //             };
    //         }
    //         return event;
    //     }));

    //     setShowConfirmation(false);
    //     setShowSuccess(true);

    //     // Reset form
    //     setFormData({ name: '', phone: '', email: '' });
    //     setSelectedEvents([]);
    //     setErrors({ name: '', phone: '', email: '', events: '' });

    //     // Auto-hide success message after 2 seconds
    //     setTimeout(() => {
    //         setShowSuccess(false);
    //     }, 1000);
    // };


    const confirmRegistration = async () => {
        try {
            for (const eventId of selectedEvents) {
                const event = events.find(e => e.id === eventId);
                if (!event) continue;

                const payload = {
                    day: selectedDay === 'Day 1' ? 'Day 1' : 'Day 2',
                    name: formData.name,
                    email: formData.email,
                    phone: formData.phone,
                    event_name: event.name,
                };

                const res = await fetch("/api/spot-register/", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(payload),
                });
                if (!res.ok) {
                    const errorData = await res.text();
                    console.error("Backend error response:", errorData);
                    throw new Error(errorData);
                }

            }

            // Update event counts based on selection
            setEvents(prevEvents => prevEvents.map(event => {
                if (selectedEvents.includes(event.id)) {
                    const isFull = event.registeredCount >= event.totalSpots;
                    return {
                        ...event,
                        registeredCount: isFull ? event.registeredCount : event.registeredCount + 1,
                        extraRegistrations: isFull ? event.extraRegistrations + 1 : event.extraRegistrations
                    };
                }
                return event;
            }));

            // ONLY after backend success
            setShowConfirmation(false);
            setShowSuccess(true);

            // Reset form
            setFormData({ name: '', phone: '', email: '' });
            setSelectedEvents([]);
            setErrors({ name: '', phone: '', email: '', events: '' });

            setTimeout(() => setShowSuccess(false), 1000);

        } catch (error) {
            console.error(error);
            alert("Registration failed. Please try again.");
        }
    };

    return (
        <div className="max-w-2xl mx-auto bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-100 relative">
            <div className="bg-gradient-to-r from-black to-black p-8 text-white text-center">
                <img src="/logo-full.svg" alt="" />
                <p className="text-blue-200 text-sm tracking-wide mt-5">On-Spot Registration</p>
            </div>

            <form onSubmit={handleInitialSubmit} className="p-8 space-y-8">

                {/* Day Selection */}
                <div className="flex justify-center space-x-4 mb-8">
                    {(['Day 1', 'Day 2'] as const).map((day) => (
                        <button
                            key={day}
                            type="button"
                            onClick={() => setSelectedDay(day)}
                            className={`px-6 py-2 rounded-full font-medium transition-all duration-200 ${selectedDay === day
                                ? 'bg-blue-600 text-white shadow-lg scale-105'
                                : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                                }`}
                        >
                            {day}
                        </button>
                    ))}
                </div>

                {/* Personal Details */}
                <div className="space-y-4">
                    <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                        <User className="w-5 h-5 text-blue-600" /> Personal Details
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="relative">
                            <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                name="name"
                                placeholder="Full Name"
                                value={formData.name}
                                onChange={handleInputChange}
                                className={`w-full text-black pl-10 pr-4 py-2 border rounded-lg focus:ring-2 outline-none transition-all ${errors.name ? 'border-red-500 ring-red-100' : 'focus:ring-blue-500 focus:border-transparent'}`}
                            />
                            {errors.name && <p className="text-red-500 text-xs mt-1 ml-1">{errors.name}</p>}
                        </div>
                        <div className="relative">
                            <Phone className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                            <input
                                type="tel"
                                name="phone"
                                placeholder="Phone Number"
                                value={formData.phone}
                                onChange={handleInputChange}
                                className={`w-full text-black pl-10 pr-4 py-2 border rounded-lg focus:ring-2 outline-none transition-all ${errors.phone ? 'border-red-500 ring-red-100' : 'focus:ring-blue-500 focus:border-transparent'}`}
                            />
                            {errors.phone && <p className="text-red-500 text-xs mt-1 ml-1">{errors.phone}</p>}
                        </div>
                        <div className="relative col-span-1 md:col-span-2">
                            <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                            <input
                                type="email"
                                name="email"
                                placeholder="Email Address"
                                value={formData.email}
                                onChange={handleInputChange}
                                className={`w-full text-black pl-10 pr-4 py-2 border rounded-lg focus:ring-2 outline-none transition-all ${errors.email ? 'border-red-500 ring-red-100' : 'focus:ring-blue-500 focus:border-transparent'}`}
                            />
                            {errors.email && <p className="text-red-500 text-xs mt-1 ml-1">{errors.email}</p>}
                        </div>
                    </div>
                </div>

                {/* Event Selection */}
                <div className="space-y-4">
                    <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-blue-600" /> Select Events
                    </h2>
                    {errors.events && <p className="text-red-500 text-sm bg-red-50 p-2 rounded-md border border-red-100">{errors.events}</p>}
                    <div className="space-y-3">
                        {filteredEvents.map((event) => {
                            const isSelected = selectedEvents.includes(event.id);
                            const remaining = event.totalSpots - event.registeredCount;

                            return (
                                <div
                                    key={event.id}
                                    onClick={() => toggleEvent(event.id)}
                                    className={`relative p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 group ${isSelected
                                        ? 'border-blue-500 bg-blue-50'
                                        : 'border-gray-100 hover:border-blue-200 hover:bg-gray-50'
                                        }`}
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-6 h-6 rounded-md flex items-center justify-center border transition-colors ${isSelected ? 'bg-blue-500 border-blue-500' : 'border-gray-300 bg-white'
                                                }`}>
                                                {isSelected && <Check className="w-4 h-4 text-white" />}
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-gray-900">{event.name}</h3>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Status Indicators */}
                                    <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-gray-100">
                                        <div className="flex flex-col">
                                            <span className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Remaining Spots</span>
                                            <span className={`text-sm font-bold ${remaining > 0 ? 'text-green-600' : 'text-red-500'}`}>
                                                {remaining > 0 ? remaining : 0}
                                            </span>
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Extra / Waitlist</span>
                                            <span className={`text-sm font-bold ${event.extraRegistrations > 0 ? 'text-amber-600' : 'text-gray-400'}`}>
                                                {remaining === 0 ? event.extraRegistrations : 0}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                        {filteredEvents.length === 0 && (
                            <p className="text-gray-500 text-center py-4">No events available for this day.</p>
                        )}
                    </div>
                </div>

                <button
                    type="submit"
                    className="w-full bg-blue-900 hover:bg-blue-800 text-white font-bold py-3 rounded-xl transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                    Confirm Registration
                </button>
            </form>

            {/* Confirmation Popup */}
            {showConfirmation && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 transition-all animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 transform transition-all scale-100">
                        <div className="text-center mb-6">
                            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Check className="w-8 h-8 text-blue-600" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">Confirm Registration?</h3>
                            <p className="text-gray-500">
                                Please review your details before submitting.
                            </p>
                        </div>

                        <div className="space-y-3 mb-8 bg-gray-50 p-4 rounded-xl text-left">
                            <div className="flex justify-between">
                                <span className="text-gray-500">Name:</span>
                                <span className="font-semibold text-gray-900">{formData.name}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">Phone:</span>
                                <span className="font-semibold text-gray-900">{formData.phone}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">Email:</span>
                                <span className="font-semibold text-gray-900 truncate max-w-[200px]">{formData.email}</span>
                            </div>
                            <div className="pt-2 border-t border-gray-200">
                                <span className="text-gray-500 block mb-1">Selected Events:</span>
                                <ul className="list-disc list-inside text-sm text-gray-800">
                                    {events.filter(e => selectedEvents.includes(e.id)).map(e => (
                                        <li key={e.id}>{e.name}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <button
                                onClick={() => setShowConfirmation(false)}
                                className="flex-1 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmRegistration}
                                className="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-md transition-colors"
                            >
                                Confirm & Submit
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Success Popup */}
            {showSuccess && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/90 backdrop-blur-md transition-all animate-in fade-in duration-300">
                    <div className="text-center transform transition-all animate-in zoom-in duration-300">
                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                            <Check className="w-10 h-10 text-green-600" />
                        </div>
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">Registration Successful!</h2>
                        <p className="text-gray-500">Ready for next participant...</p>
                    </div>
                </div>
            )}
        </div>
    );
}
