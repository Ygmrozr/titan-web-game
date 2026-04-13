const gameLevels = {
  1: {
    name: "Training District",
    background: "/images/levels/level1.png",
    sectors: {
      1: {
        objective: "Defeat 3 giants",
        enemyCount: 3,
        reward: 50
      },
      2: {
        objective: "Collect 2 supplies",
        enemyCount: 4,
        reward: 60
      },
      3: {
        objective: "Reach the checkpoint",
        enemyCount: 5,
        reward: 70
      },
      4: {
        objective: "Defeat 5 giants",
        enemyCount: 5,
        reward: 80
      },
      5: {
        objective: "Collect 3 supplies",
        enemyCount: 6,
        reward: 90
      },
      6: {
        objective: "Protect the gate",
        enemyCount: 6,
        reward: 100
      },
      7: {
        objective: "Defeat the wave",
        enemyCount: 7,
        reward: 110
      },
      8: {
        objective: "Reach the inner district",
        enemyCount: 7,
        reward: 120
      },
      9: {
        objective: "Defeat elite giant",
        enemyCount: 8,
        reward: 140
      },
      10: {
        objective: "Clear the district",
        enemyCount: 10,
        reward: 200
      }
    }
  },

  2: {
    name: "Outer Wall Streets",
    background: "/images/levels/level2.png",
    sectors: {
      1: { objective: "Defeat 4 giants", enemyCount: 4, reward: 60 },
      2: { objective: "Collect 2 supplies", enemyCount: 5, reward: 70 },
      3: { objective: "Reach the checkpoint", enemyCount: 5, reward: 80 },
      4: { objective: "Defeat 6 giants", enemyCount: 6, reward: 90 },
      5: { objective: "Collect 3 supplies", enemyCount: 6, reward: 100 },
      6: { objective: "Protect the civilians", enemyCount: 7, reward: 110 },
      7: { objective: "Defeat the wave", enemyCount: 7, reward: 120 },
      8: { objective: "Reach the inner district", enemyCount: 8, reward: 130 },
      9: { objective: "Defeat elite giant", enemyCount: 8, reward: 150 },
      10: { objective: "Clear the streets", enemyCount: 10, reward: 220 }
    }
  },

  3: {
    name: "Forest Operation",
    background: "/images/levels/level3.png",
    sectors: {
      1: { objective: "Defeat 5 giants", enemyCount: 5, reward: 70 },
      2: { objective: "Collect 2 supplies", enemyCount: 6, reward: 80 },
      3: { objective: "Reach the checkpoint", enemyCount: 6, reward: 90 },
      4: { objective: "Defeat 7 giants", enemyCount: 7, reward: 100 },
      5: { objective: "Collect 3 supplies", enemyCount: 7, reward: 110 },
      6: { objective: "Escort ally", enemyCount: 8, reward: 120 },
      7: { objective: "Defeat the wave", enemyCount: 8, reward: 130 },
      8: { objective: "Reach the camp", enemyCount: 9, reward: 140 },
      9: { objective: "Defeat elite giant", enemyCount: 9, reward: 160 },
      10: { objective: "Clear the forest", enemyCount: 11, reward: 240 }
    }
  },

  4: {
    name: "Ruined City",
    background: "/images/levels/level4.png",
    sectors: {
      1: { objective: "Defeat 6 giants", enemyCount: 6, reward: 80 },
      2: { objective: "Collect 2 supplies", enemyCount: 7, reward: 90 },
      3: { objective: "Reach the checkpoint", enemyCount: 7, reward: 100 },
      4: { objective: "Defeat 8 giants", enemyCount: 8, reward: 110 },
      5: { objective: "Collect 3 supplies", enemyCount: 8, reward: 120 },
      6: { objective: "Protect the ruins", enemyCount: 9, reward: 130 },
      7: { objective: "Defeat the wave", enemyCount: 9, reward: 140 },
      8: { objective: "Reach the tower", enemyCount: 10, reward: 150 },
      9: { objective: "Defeat elite giant", enemyCount: 10, reward: 170 },
      10: { objective: "Clear the city", enemyCount: 12, reward: 260 }
    }
  },

  5: {
    name: "Final Breach",
    background: "/images/levels/level5.png",
    sectors: {
      1: { objective: "Defeat 7 giants", enemyCount: 7, reward: 90 },
      2: { objective: "Collect 2 supplies", enemyCount: 8, reward: 100 },
      3: { objective: "Reach the checkpoint", enemyCount: 8, reward: 110 },
      4: { objective: "Defeat 9 giants", enemyCount: 9, reward: 120 },
      5: { objective: "Collect 3 supplies", enemyCount: 9, reward: 130 },
      6: { objective: "Defend the gate", enemyCount: 10, reward: 140 },
      7: { objective: "Defeat the wave", enemyCount: 10, reward: 150 },
      8: { objective: "Reach the breach", enemyCount: 11, reward: 160 },
      9: { objective: "Defeat elite giant", enemyCount: 11, reward: 180 },
      10: { objective: "Final sector clear", enemyCount: 13, reward: 300 }
    }
  }
};

export default gameLevels;