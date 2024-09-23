'use client';

import { useState } from 'react';

export default function SetAdminPage() {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await fetch('/api/set-admin', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });
            const data = await response.json();
            setMessage(data.message || data.error);
        } catch (error: unknown) {
            console.error('Error setting admin rights:', error);
            setMessage('An error occurred');
        }
    };

    return (
        <div>
            <h1>Assign Admin Rights</h1>
            <form onSubmit={handleSubmit}>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email address"
                    required
                />
                <button type="submit">Assign Admin Rights</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
}