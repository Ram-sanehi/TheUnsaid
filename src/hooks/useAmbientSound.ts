import { useState, useCallback, useEffect, useRef } from 'react';

export type SoundTrack = 'off' | 'rain' | 'quiet_room' | 'night';

const SOUND_URLS: Record<Exclude<SoundTrack, 'off'>, string> = {
  rain:        'https://cdn.pixabay.com/audio/2022/03/24/audio_1639f88612.mp3',
  quiet_room:  'https://cdn.pixabay.com/audio/2022/01/18/audio_d0c6ff1bab.mp3',
  night:       'https://cdn.pixabay.com/audio/2021/09/06/audio_2ccf38e3a7.mp3',
};

const TRACK_KEY  = 'tgwfhe_sound_track';
const VOL_KEY    = 'tgwfhe_sound_volume';

export function useAmbientSound() {
  const [track, setTrack]   = useState<SoundTrack>('off');
  const [volume, setVolume] = useState(0.3);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const savedTrack = (localStorage.getItem(TRACK_KEY) as SoundTrack) ?? 'off';
    const savedVol   = parseFloat(localStorage.getItem(VOL_KEY) ?? '0.3');
    setTrack(savedTrack);
    setVolume(savedVol);
  }, []);

  // Switch track
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    if (track === 'off') return;

    const audio = new Audio(SOUND_URLS[track]);
    audio.loop = true;
    audio.volume = volume;
    audio.play().catch(() => {}); // ignore autoplay block
    audioRef.current = audio;

    return () => {
      audio.pause();
      audioRef.current = null;
    };
  }, [track]);

  // Update volume without restarting
  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
  }, [volume]);

  const changeTrack = useCallback((t: SoundTrack) => {
    setTrack(t);
    localStorage.setItem(TRACK_KEY, t);
  }, []);

  const changeVolume = useCallback((v: number) => {
    const clamped = Math.max(0, Math.min(1, v));
    setVolume(clamped);
    localStorage.setItem(VOL_KEY, String(clamped));
  }, []);

  return { track, volume, changeTrack, changeVolume };
}
