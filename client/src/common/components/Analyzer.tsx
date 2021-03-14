import { h } from 'preact';
import { useEffect, useState } from 'preact/hooks';

async function getAudioStream() {
  const stream = await navigator.mediaDevices.getUserMedia({
    audio: true,
  });
  return stream;
}

export const Analyzer = () => {
  const [stream, setStream] = useState<MediaStream | undefined>(undefined);
  const [analyzer, setAnalyzer] = useState<AnalyserNode | undefined>(undefined);
  const [audioCtx] = useState(new AudioContext());

  useEffect(() => {
    getAudioStream().then((stream) => setStream(stream));
  }, []);

  useEffect(() => {
    if (!stream) {
      return;
    }
    const analyzer = audioCtx.createAnalyser();
    const mic = audioCtx.createMediaStreamSource(stream);
    mic.connect(analyzer);
    setAnalyzer(analyzer);
  }, [stream]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!analyzer) {
        return;
      }

      const ff = new Float32Array(analyzer.frequencyBinCount);
      analyzer.getFloatFrequencyData(ff);
      const maxIndex = ff.reduce((max, cur, i) => (cur > ff[max] ? i : max), 0);
      console.log(maxIndex);
    }, 50);
    return () => clearInterval(interval);
  }, [analyzer]);

  return <div></div>;
};
