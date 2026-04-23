const gameLevels = {
  1: {
    name: "Training District",
    background: "/images/levels/level1.png",
    sectors: {

      1: { objectiveType: "kill", objectiveText: "Defeat a giant", enemyCount: 1, reward: 50},
      2: { objectiveType: "collect", objectiveText: "Collect 2 gasses", itemTarget: 2, enemyCount: 4, reward: 60},
      3: { objectiveType: "kill", objectiveText: "Defeat 4 giants", enemyCount: 4, reward: 70},
      4: { objectiveType: "kill", objectiveText: "Defeat 5 giants", enemyCount: 5, reward: 80},
      5: { objectiveType: "collect", objectiveText: "Collect 3 gasses", enemyCount: 6, reward: 90},
      6: { objectiveType: "kill", objectiveText: "Defeat 6 giants", enemyCount: 1, reward: 100},
      7: { objectiveType: "kill", objectiveText: "Defeat 7 giants", enemyCount: 1, reward: 110},
      8: { objectiveType: "reach", objectiveText: "Reach the inner district", enemyCount: 7, reward: 120},
      9: { objectiveType: "kill", objectiveText: "Defeat 8 giants", enemyCount: 1, reward: 140},
      10: { objectiveType: "kill", objectiveText: "Defeat the boss giant", enemyCount: 1, reward: 200}

    }
  },

  2: {
    name: "Outer Wall Streets",
    background: "/images/levels/level2.png",
    sectors: {
      1: { objectiveType: "kill", objectiveText: "Defeat 3 giants", enemyCount: 3, reward: 50},
      2: { objectiveType: "collect", objectiveText: "Collect 2 gasses", itemTarget: 2, enemyCount: 4, reward: 60},
      3: { objectiveType: "kill", objectiveText: "Defeat 4 giants", enemyCount: 5, reward: 70},
      4: { objectiveType: "kill", objectiveText: "Defeat 5 giants", enemyCount: 5, reward: 80},
      5: { objectiveType: "collect", objectiveText: "Collect 3 supplies", enemyCount: 6, reward: 90},
      6: { objectiveType: "kill", objectiveText: "Defeat 6 giants", enemyCount: 6, reward: 100},
      7: { objectiveType: "kill", objectiveText: "Defeat 7 giants", enemyCount: 7, reward: 110},
      8: { objectionType: "reach", objectiveText: "Reach the inner district", enemyCount: 7, reward: 120},
      9: { objectionType: "kill", objectiveText: "Defeat 8 giants", enemyCount: 8, reward: 140},
      10: { objectiveType: "kill", objectiveText: "Defeat the boss giant", enemyCount: 10, reward: 200}
    }
  },

  3: {
    name: "Forest Operation",
    background: "/images/levels/level3.png",
    sectors: {
      1: { objectiveType: "kill", objectiveText: "Defeat 3 giants", enemyCount: 3, reward: 50},
      2: { objectiveType: "collect", objectiveText: "Collect 2 gasses", itemTarget: 2, enemyCount: 4, reward: 60},
      3: { objectiveType: "kill", objectiveText: "Defeat 4 giants", enemyCount: 5, reward: 70},
      4: { objectiveType: "kill", objectiveText: "Defeat 5 giants", enemyCount: 5, reward: 80},
      5: { objectiveType: "collect", objectiveText: "Collect 3 supplies", enemyCount: 6, reward: 90},
      6: { objectiveType: "kill", objectiveText: "Defeat 6 giants", enemyCount: 6, reward: 100},
      7: { objectiveType: "kill", objectiveText: "Defeat 7 giants", enemyCount: 7, reward: 110},
      8: { objectionType: "reach", objectiveText: "Reach the inner district", enemyCount: 7, reward: 120},
      9: { objectionType: "kill", objectiveText: "Defeat 8 giants", enemyCount: 8, reward: 140},
      10: { objectiveType: "kill", objectiveText: "Defeat the boss giant", enemyCount: 10, reward: 200}
    }
  },

  4: {
    name: "Ruined City",
    background: "/images/levels/level4.png",
    sectors: {
      1: { objectiveType: "kill", objectiveText: "Defeat 3 giants", enemyCount: 3, reward: 50},
      2: { objectiveType: "collect", objectiveText: "Collect 2 gasses", itemTarget: 2, enemyCount: 4, reward: 60},
      3: { objectiveType: "kill", objectiveText: "Defeat 4 giants", enemyCount: 5, reward: 70},
      4: { objectiveType: "kill", objectiveText: "Defeat 5 giants", enemyCount: 5, reward: 80},
      5: { objectiveType: "collect", objectiveText: "Collect 3 supplies", enemyCount: 6, reward: 90},
      6: { objectiveType: "kill", objectiveText: "Defeat 6 giants", enemyCount: 6, reward: 100},
      7: { objectiveType: "kill", objectiveText: "Defeat 7 giants", enemyCount: 7, reward: 110},
      8: { objectionType: "reach", objectiveText: "Reach the inner district", enemyCount: 7, reward: 120},
      9: { objectionType: "kill", objectiveText: "Defeat 8 giants", enemyCount: 8, reward: 140},
      10: { objectiveType: "kill", objectiveText: "Defeat the boss giant", enemyCount: 10, reward: 200}
    }
  },

  5: {
    name: "Final Breach",
    background: "/images/levels/level5.png",
    sectors: {
      1: { objectiveType: "kill", objectiveText: "Defeat 3 giants", enemyCount: 3, reward: 50},
      2: { objectiveType: "collect", objectiveText: "Collect 2 gasses", itemTarget: 2, enemyCount: 4, reward: 60},
      3: { objectiveType: "kill", objectiveText: "Defeat 4 giants", enemyCount: 5, reward: 70},
      4: { objectiveType: "kill", objectiveText: "Defeat 5 giants", enemyCount: 5, reward: 80},
      5: { objectiveType: "collect", objectiveText: "Collect 3 supplies", enemyCount: 6, reward: 90},
      6: { objectiveType: "kill", objectiveText: "Defeat 6 giants", enemyCount: 6, reward: 100},
      7: { objectiveType: "kill", objectiveText: "Defeat 7 giants", enemyCount: 7, reward: 110},
      8: { objectionType: "reach", objectiveText: "Reach the inner district", enemyCount: 7, reward: 120},
      9: { objectionType: "kill", objectiveText: "Defeat 8 giants", enemyCount: 8, reward: 140},
      10: { objectiveType: "kill", objectiveText: "Defeat the boss giant", enemyCount: 10, reward: 200}
    }
  }
};

export default gameLevels;