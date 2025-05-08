
export const pageTransition = {
  initial: {
    opacity: 0,
    y: 10
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.16, 1, 0.3, 1]
    }
  },
  exit: {
    opacity: 0,
    y: -10,
    transition: {
      duration: 0.3,
      ease: [0.16, 1, 0.3, 1]
    }
  }
};

export const staggerContainer = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.08
    }
  }
};

export const fadeInUp = {
  initial: {
    opacity: 0,
    y: 20
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.16, 1, 0.3, 1]
    }
  }
};

export const scaleIn = {
  initial: {
    opacity: 0,
    scale: 0.94
  },
  animate: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: [0.16, 1, 0.3, 1]
    }
  }
};

export const slideIn = (direction: "left" | "right" | "up" | "down", delay = 0) => {
  const directions = {
    left: { x: -30, y: 0 },
    right: { x: 30, y: 0 },
    up: { x: 0, y: -30 },
    down: { x: 0, y: 30 }
  };

  return {
    initial: {
      opacity: 0,
      x: directions[direction].x,
      y: directions[direction].y
    },
    animate: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: {
        delay,
        duration: 0.5,
        ease: [0.16, 1, 0.3, 1]
      }
    }
  };
};

export const animateList = (delay = 0) => ({
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: {
      delay,
      staggerChildren: 0.1
    }
  }
});

export const animateListItem = {
  initial: { opacity: 0, y: 10 },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.16, 1, 0.3, 1]
    }
  }
};
