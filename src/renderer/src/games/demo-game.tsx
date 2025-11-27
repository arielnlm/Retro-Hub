import React, { useState } from 'react';

const DemoGame: React.FC = () => {
    const [count, setCount] = useState(0);

    return (
        <div style={{ padding: '10px', textAlign: 'center' }}>
            <p>Ovo je primer kako izgleda igra unutar prozora!</p>
            <div className="field-row" style={{ justifyContent: 'center' }}>
                <button onClick={() => setCount(c => c + 1)}>Klikni me!</button>
                <label>Brojač: {count}</label>
            </div>
        </div>
    );
};

export default DemoGame;