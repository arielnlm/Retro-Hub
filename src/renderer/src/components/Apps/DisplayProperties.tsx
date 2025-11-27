import React, { useState } from 'react';
import { ScreenSaverType, useOSStore, WallpaperStyle } from '../../store/os-store';
import MonitorPreview from './MonitorPreview';

const WALLPAPERS = [
    { name: '(None)', url: null },
    { name: 'Azul', url: 'https://static.wikitide.net/windowswallpaperwiki/a/a4/Azul.jpg' },
    { name: 'Bliss (XP)', url: 'https://upload.wikimedia.org/wikipedia/en/2/27/Bliss_%28Windows_XP%29.png' },
    { name: 'Ascent', url: 'https://static.wikitide.net/windowswallpaperwiki/6/63/Ascent.jpg' },
    { name: 'Setup', url: 'https://static.wikitide.net/windowswallpaperwiki/3/30/Windows_XP_Professional.jpg' }
];

const SCHEMES = [
    { name: 'Windows Standard', desktop: '#008080', header: '#000080' },
    { name: 'Rainy Day', desktop: '#4A5D6E', header: '#4A5D6E' },
    { name: 'Eggplant', desktop: '#400040', header: '#800080' },
    { name: 'High Contrast Black', desktop: '#000000', header: '#800080' },
    { name: 'Rose', desktop: '#DDA0DD', header: '#8B4969' },
];

const SCREENSAVERS = [
    { name: '(None)', id: 'none' },
    { name: 'Blank Screen', id: 'blank' },
    { name: 'Flying Windows', id: 'windows_logo' },
    { name: 'Matrix', id: 'matrix' },
];

const DisplayProperties = () => {
    const store = useOSStore();
    const { setWallpaper, setScreenSaver, setTheme, closeWindow } = store;

    const [activeTab, setActiveTab] = useState('Background');

    const [bgImage, setBgImage] = useState(store.wallpaperImage);
    const [bgStyle, setBgStyle] = useState<WallpaperStyle>(store.wallpaperStyle);
    const [bgColor, setBgColor] = useState(store.backgroundColor);

    const [saverType, setSaverType] = useState<ScreenSaverType>(store.screenSaverType);
    const [saverWait, setSaverWait] = useState(store.screenSaverTimeout);

    const [headerColor, setHeaderColor] = useState(store.windowHeaderColor);
    const [selectedScheme, setSelectedScheme] = useState('Windows Standard');

    const [resolution, setResolution] = useState(100); 

    const handleApply = () => {
        setWallpaper(bgImage, bgStyle, bgColor);
        setScreenSaver(saverType, saverWait);
        setTheme(headerColor, bgColor);
    };

    const handleOK = () => {
        handleApply();
        const myWindow = useOSStore.getState().windows.find(w => w.gameId === 'display_properties');
        if (myWindow) closeWindow(myWindow.id);
    };

    const handleCancel = () => {
        const myWindow = useOSStore.getState().windows.find(w => w.gameId === 'display_properties');
        if (myWindow) closeWindow(myWindow.id);
    };

    const handleSchemeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const scheme = SCHEMES.find(s => s.name === e.target.value);
        if (scheme) {
            setSelectedScheme(scheme.name);
            setBgColor(scheme.desktop);
            setHeaderColor(scheme.header);
            setBgImage(null); 
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: 4 }}>

            <menu role="tablist" style={{ margin: '0 0 2px 0' }}>
                {['Background', 'Screen Saver', 'Appearance', 'Settings'].map(tab => (
                    <li key={tab} role="tab" aria-selected={activeTab === tab} onClick={() => setActiveTab(tab)}>
                        <a href={`#${tab}`}>{tab}</a>
                    </li>
                ))}
            </menu>

            <div className="window" role="tabpanel" style={{ flex: 1, position: 'relative' }}>
                <div className="window-body" style={{ height: '100%' }}>

                    {activeTab === 'Background' && (
                        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: 10 }}>
                            <MonitorPreview>
                                <div style={{
                                    width: '100%', height: '100%', backgroundColor: bgColor,
                                    backgroundImage: bgImage ? `url(${bgImage})` : 'none',
                                    backgroundSize: bgStyle === 'stretch' ? '100% 100%' : (bgStyle === 'tile' ? '20px' : 'contain'),
                                    backgroundRepeat: bgStyle === 'tile' ? 'repeat' : 'no-repeat',
                                    backgroundPosition: 'center'
                                }} />
                            </MonitorPreview>

                            <fieldset style={{ flex: 1, display: 'flex', flexDirection: 'column', margin: 0 }}>
                                <legend>Wallpaper</legend>
                                <div style={{ display: 'flex', gap: 10, height: '100%' }}>
                                    <div className="sunken-panel" style={{ flex: 1, background: 'white', overflowY: 'auto' }}>
                                        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                                            {WALLPAPERS.map(wp => (
                                                <li key={wp.name} onClick={() => setBgImage(wp.url)}
                                                    style={{ padding: '2px 5px', cursor: 'pointer', backgroundColor: bgImage === wp.url ? '#000080' : 'transparent', color: bgImage === wp.url ? 'white' : 'black' }}>
                                                    {wp.name}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div style={{ width: 80, display: 'flex', flexDirection: 'column', gap: 5 }}>
                                        <button>Browse...</button>
                                        <div style={{ marginTop: 'auto' }}>
                                            <label>Display:</label>
                                            <select value={bgStyle} onChange={(e) => setBgStyle(e.target.value as any)} style={{ width: '100%' }}>
                                                <option value="center">Center</option>
                                                <option value="tile">Tile</option>
                                                <option value="stretch">Stretch</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </fieldset>
                        </div>
                    )}

                    {activeTab === 'Screen Saver' && (
                        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: 10 }}>
                            <MonitorPreview>
                                <div style={{ width: '100%', height: '100%', background: 'black', color: '#0f0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10 }}>
                                    {saverType === 'windows_logo' && <span>🪟</span>}
                                    {saverType === 'matrix' && <span>101010</span>}
                                    {saverType === 'blank' && <span></span>}
                                    {saverType === 'none' && <span style={{ color: 'gray' }}>Desktop</span>}
                                </div>
                            </MonitorPreview>

                            <fieldset style={{ padding: 10 }}>
                                <legend>Screen Saver</legend>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                                    <select value={saverType} onChange={(e) => setSaverType(e.target.value as any)} style={{ width: '100%' }}>
                                        {SCREENSAVERS.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                                    </select>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                        <button style={{ width: 80 }}>Settings...</button>
                                        <button style={{ width: 80 }}>Preview</button>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                                        <label>Wait:</label>
                                        <input type="number" value={saverWait} onChange={(e) => setSaverWait(Number(e.target.value))} style={{ width: 50 }} min={1} max={60} />
                                        <label>minutes</label>
                                    </div>
                                </div>
                            </fieldset>

                            <fieldset style={{ padding: 10, marginTop: 'auto' }}>
                                <legend>Energy saving features of monitor</legend>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                    <img src="https://win98icons.alexmeub.com/icons/png/shut_down_cool-2.png" style={{ height: 32 }} />
                                    <div style={{ fontSize: 12 }}>
                                        To adjust the power settings for your monitor, click Settings.
                                    </div>
                                    <button>Settings...</button>
                                </div>
                            </fieldset>
                        </div>
                    )}

                    {activeTab === 'Appearance' && (
                        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: 10 }}>
                            <MonitorPreview>
                                <div style={{ width: '100%', height: '100%', background: bgColor, position: 'relative', overflow: 'hidden' }}>
                                    <div className="window" style={{ position: 'absolute', top: 10, left: 10, width: 100, height: 80, zIndex: 2 }}>
                                        <div className="title-bar" style={{ background: `linear-gradient(90deg, ${headerColor}, #1084d0)` }}>
                                            <div className="title-bar-text">Active</div>
                                            <div className="title-bar-controls"><button aria-label="Close" /></div>
                                        </div>
                                        <div className="window-body">Text</div>
                                    </div>
                                    <div className="window" style={{ position: 'absolute', top: 30, left: 40, width: 80, height: 60, zIndex: 1 }}>
                                        <div className="title-bar" style={{ background: 'gray' }}>
                                            <div className="title-bar-text">Inactive</div>
                                        </div>
                                    </div>
                                </div>
                            </MonitorPreview>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                                <label>Scheme:</label>
                                <select value={selectedScheme} onChange={handleSchemeChange}>
                                    {SCHEMES.map(s => <option key={s.name} value={s.name}>{s.name}</option>)}
                                </select>
                                <div style={{ display: 'flex', gap: 5 }}>
                                    <button disabled>Save As...</button>
                                    <button disabled>Delete</button>
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: 10, marginTop: 10 }}>
                                <div style={{ flex: 1 }}>
                                    <label>Item:</label>
                                    <select style={{ width: '100%' }} disabled><option>Desktop</option></select>
                                </div>
                                <div style={{ width: 60 }}>
                                    <label>Size:</label>
                                    <input disabled type="number" style={{ width: '100%' }} />
                                </div>
                                <div style={{ width: 60 }}>
                                    <label>Color:</label>
                                    <button style={{ width: '100%', background: bgColor }} onClick={() => alert("Color picker coming soon!")}></button>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'Settings' && (
                        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: 10 }}>
                            <div style={{
                                margin: '10px auto', width: 200, height: 140,
                                backgroundImage: 'url("https://win98icons.alexmeub.com/images/computer-monitor.png")',
                                backgroundSize: 'contain', backgroundRepeat: 'no-repeat', backgroundPosition: 'center',
                                position: 'relative'
                            }}>
                                <div style={{ position: 'absolute', top: 20, left: 25, right: 25, bottom: 40, background: `url(${bgImage})`, backgroundSize: 'cover' }} />
                            </div>

                            <div style={{ padding: 10, background: 'white', border: '1px solid gray', marginBottom: 10 }}>
                                Display: <br />
                                <b>Plug and Play Monitor on NVIDIA GeForce RTX 4090</b>
                            </div>

                            <div style={{ display: 'flex', gap: 20 }}>
                                <fieldset style={{ flex: 1, padding: 10 }}>
                                    <legend>Colors</legend>
                                    <select style={{ width: '100%' }}>
                                        <option>True Color (32 bit)</option>
                                        <option>High Color (16 bit)</option>
                                        <option>256 Colors</option>
                                    </select>
                                </fieldset>

                                <fieldset style={{ flex: 1, padding: 10 }}>
                                    <legend>Screen area</legend>
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 11 }}>
                                        <span>Less</span><span>More</span>
                                    </div>
                                    <input
                                        type="range" min="0" max="100" value={resolution}
                                        onChange={(e) => setResolution(Number(e.target.value))}
                                        style={{ width: '100%' }}
                                    />
                                    <div style={{ textAlign: 'center', marginTop: 5 }}>
                                        {1024 + Math.floor(resolution * 10)} by {768 + Math.floor(resolution * 5)} pixels
                                    </div>
                                </fieldset>
                            </div>
                        </div>
                    )}

                </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 5, marginTop: 10 }}>
                <button onClick={handleOK} style={{ minWidth: 70 }}>OK</button>
                <button onClick={handleCancel} style={{ minWidth: 70 }}>Cancel</button>
                <button onClick={handleApply} style={{ minWidth: 70 }}>Apply</button>
            </div>

        </div>
    );
};

export default DisplayProperties;