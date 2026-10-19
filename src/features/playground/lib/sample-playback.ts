import type { ShadowingPlayer } from '../types/shadowing';

export interface SampleOptions { rate: number; loop: boolean; autoPause: boolean }
interface Sample {
  player: ShadowingPlayer;
  start: number;
  end: number;
  arrived: boolean;
  entered: boolean;
  deadline: number;
}

/** Owns sample playback only; microphone/replay playback belongs to other controllers. */
export class SamplePlayback {
  private sample: Sample | null = null;

  constructor(
    private readonly getPlayer: () => ShadowingPlayer | null,
    private readonly getOptions: () => SampleOptions,
    private readonly now = () => performance.now(),
  ) {}

  play(start: number, end: number) {
    const player = this.getPlayer();
    if (!player || !Number.isFinite(start) || !Number.isFinite(end) || start < 0 || end <= start) return;
    this.sample = { player, start, end, arrived: false, entered: false, deadline: this.now() + 15000 };
    // Commands and the SDK's cached clock update asynchronously. Halt the old
    // sample before seeking; tick() must still confirm arrival near the new start.
    player.pauseVideo();
    player.setPlaybackRate(this.getOptions().rate);
    player.unMute();
    player.seekTo(start, true);
    player.playVideo();
  }

  stop() {
    const sample = this.sample;
    this.sample = null;
    if (sample && this.getPlayer() === sample.player) sample.player.pauseVideo();
  }

  tick() {
    const sample = this.sample;
    if (!sample) return;
    if (this.getPlayer() !== sample.player) { this.sample = null; return; }
    if (!sample.entered && this.now() > sample.deadline) { this.stop(); return; }
    const player = sample.player;
    const time = player.getCurrentTime(), state = player.getPlayerState();
    if (!Number.isFinite(time)) return;
    if (!sample.entered) {
      // A stale timestamp near the END of this same sentence is not a seek ack.
      // Bound confirmation to its start, especially for sub-second sentences.
      const tolerance = Math.min(0.15, (sample.end - sample.start) / 4);
      if (time >= sample.start - tolerance && time <= sample.start + tolerance) sample.arrived = true;
      // The SDK can report the seek position while BUFFERING and report PLAYING
      // only after the media clock has advanced well into a short sentence.
      if (!sample.arrived || state !== 1) return;
      sample.entered = true;
    }
    // Never decide that speech has ended from a buffering/paused cached clock.
    if (state !== 1 && state !== 0) return;
    if (time < sample.end) return;
    const options = this.getOptions();
    if (options.loop) this.play(sample.start, sample.end);
    else if (options.autoPause) this.stop();
    else this.sample = null;
  }
}
