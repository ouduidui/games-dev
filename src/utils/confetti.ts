export const winAnimation = (duration: number) => {
  const end = Date.now() + duration

  const colors = ['#bb0000', '#ffffff'];

  (function frame() {
    confetti({
      particleCount: 2,
      angle: 60,
      spread: 55,
      origin: { x: 0 },
      colors,
    })
    confetti({
      particleCount: 2,
      angle: 120,
      spread: 55,
      origin: { x: 1 },
      colors,
    })

    if (Date.now() < end)
      requestAnimationFrame(frame)
  }())
}

export const loseAnimation = (duration: number) => {
  const animationEnd = Date.now() + duration
  let skew = 1

  const randomInRange = (min: number, max: number) =>
    Math.random() * (max - min) + min;

  (function frame() {
    const timeLeft = animationEnd - Date.now()
    const ticks = Math.max(200, 500 * (timeLeft / duration))
    skew = Math.max(0.8, skew - 0.001)

    confetti({
      particleCount: 1,
      startVelocity: 0,
      ticks,
      origin: {
        x: Math.random(),
        // since particles fall down, skew start toward the top
        y: (Math.random() * skew) - 0.2,
      },
      colors: ['#ffffff'],
      shapes: ['circle'],
      gravity: randomInRange(0.4, 0.6),
      scalar: randomInRange(0.4, 1),
      drift: randomInRange(-0.4, 0.4),
    })

    if (timeLeft > 0)
      requestAnimationFrame(frame)
  }())
}
