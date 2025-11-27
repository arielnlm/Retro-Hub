const SOUNDS = {
    startup: new URL('../assets/sounds/startup.mp3', import.meta.url).href,
    click: new URL('../assets/sounds/click.wav', import.meta.url).href,
    chord: new URL('../assets/sounds/error.wav', import.meta.url).href,
};

type SoundName = keyof typeof SOUNDS;

class AudioSystem {
    private audioCache: Record<string, HTMLAudioElement> = {};
    private isMuted: boolean = false;

    constructor() {

        Object.entries(SOUNDS).forEach(([key, path]) => {
            const audio = new Audio(path);
            audio.volume = 0.5;
            this.audioCache[key] = audio;
        });
    }

    public play(name: SoundName) {
        if (this.isMuted) return;

        const audio = this.audioCache[name];
        if (audio) {

            audio.currentTime = 0;
            audio.play().catch(e => {
                console.warn("Audio play failed (browser policy?):", e);
            });
        }
    }

    public toggleMute() {
        this.isMuted = !this.isMuted;
        return this.isMuted;
    }

    public getMutedState() {
        return this.isMuted;
    }
}


export const systemAudio = new AudioSystem();