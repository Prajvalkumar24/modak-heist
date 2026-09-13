# 🐭 Modak Heist: Mooshak's Stealth Delivery 🪔

> A 2D top-down stealth-puzzle game built for the **Ganesh Chaturthi Game Design Contest**. Play as Lord Ganesha's loyal vahana, Mooshak, navigating an ancient temple courtyard to gather sacred Modaks before the morning Aarti concludes!

🎮 **Play Live:** https://modak-heist.vercel.app/

---

## 🌟 Concept & Theme Alignment

During Ganesh Utsav, the temple sanctum is filled with divine offerings. In **Modak Heist**, players control Mooshak on a sacred stealth mission:
* **The Mission:** Retrieve fresh Modaks scattered across the temple courtyard.
* **The Destination:** Safely bring all offerings to the Garbhagriha (inner sanctum) at the feet of Lord Ganesha (`॥ श्री गणेशाय नमः ॥`).
* **The Obstacles:** Royal Temple Guards patrol the grounds with lantern vision cones, looking to protect the sanctum from sneaky critters.

---

## 🕹️ Controls & Gameplay Mechanics

| Action | Key / Control |
| :--- | :--- |
| **Move Up / Down / Left / Right** | `W`, `A`, `S`, `D` or `Arrow Keys` |
| **Sneak / Hide** | Break guard Line-of-Sight behind stone pillars |
| **Restart (on Game Over)** | `ENTER` or Click anywhere |

### Core Mechanics
* **Dynamic Line-of-Sight (Raycasting):** Guards project real-time light cones that physically stop when hitting temple pillars.
* **Autonomous AI Behavior:** Guards dynamically wander, scan surroundings, and break into a high-speed pursuit state when Mooshak enters their vision.
* **Procedural Courtyard Generation:** Non-repeating level layouts—pillar locations and modak positions dynamically adapt as difficulty scales.
* **Aarti Countdown:** A time-attack element requiring players to finish offerings before morning prayers commence.
* **Zero-Asset Web Audio:** Built-in procedural Web Audio API synthesizers producing temple bell chimes, guard alert tones, and celebration arpeggios.

---

## 🛠️ Built With

* **Game Engine:** Phaser 3 (Arcade Physics & Canvas Renderer)
* **Language:** Modern JavaScript (ES6+ Modules)
* **Audio Engine:** Native Web Audio API Synthesizer
* **Hosting:** GitHub Pages (Instant zero-install web access)

---

*🙏 Ganpati Bappa Morya!*
