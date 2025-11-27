import { useOSStore } from '../../store/os-store';
import { useFSStore } from '../../store/fs-store';

const StartMenu = () => {
    useOSStore();
    useFSStore();
    return (
        <div
            className="window start-menu-wrapper"
            style={{
                position: 'absolute',
                bottom: 28,
                left: 0,
                zIndex: 999990,
                width: 200,
                minHeight: 250,
                boxShadow: '2px 2px 5px rgba(0,0,0,0.5)',
                display: 'flex',
                flexDirection: 'row'
            }}
        >
            <div style={{
                width: 25,
                background: 'linear-gradient(180deg, #000080 0%, #1084d0 100%)',
                display: 'flex',
                alignItems: 'flex-end',
                paddingBottom: 10,
                position: 'relative'
            }}>
                <span style={{
                    transform: 'rotate(-90deg)',
                    transformOrigin: 'bottom left',
                    position: 'absolute',
                    bottom: 5,
                    left: 20,
                    color: 'white',
                    fontWeight: 'bold',
                    fontSize: 18,
                    whiteSpace: 'nowrap',
                    fontFamily: 'Arial, sans-serif'
                }}>
                    Retro<b style={{ fontWeight: 'normal' }}>OS</b>
                </span>
            </div>

            <div className="window-body" style={{ flex: 1, margin: 0, padding: 2, display: 'flex', flexDirection: 'column' }}>

                <StartMenuItem icon="☁️" label="Windows Update" />

                <hr className="start-menu-separator" />

                <StartMenuItem icon="📂" label="Programs" arrow />
                <StartMenuItem icon="📁" label="Documents" arrow />
                <StartMenuItem icon="⚙️" label="Settings" arrow />
                <StartMenuItem icon="🔍" label="Find" arrow />
                <StartMenuItem icon="❓" label="Help" />
                <StartMenuItem icon="🏃" label="Run..." />

                <hr className="start-menu-separator" />

                <StartMenuItem
                    icon="🔌"
                    label="Shut Down..."
                    onClick={() => {
                        if (confirm("It is now safe to turn off your computer.")) {
                            window.close();
                        }
                    }}
                />
            </div>
        </div>
    );
};


const StartMenuItem = ({ icon, label, arrow, onClick }: any) => (
    <div
        className="start-menu-item"
        onClick={onClick}
    >
        <div style={{ width: 24, textAlign: 'center', marginRight: 5, fontSize: 16 }}>{icon}</div>
        <div style={{ flex: 1 }}>{label}</div>
        {arrow && <div style={{ fontSize: 10 }}>▶</div>}
    </div>
);

export default StartMenu;