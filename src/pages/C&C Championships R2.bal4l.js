import wixData from 'wix-data';

$w.onReady(function () {
  // Load the rankings as soon as the page opens
  updateLeaderboard();

  // Optional: Refresh the leaderboard every 30 seconds automatically
  setInterval(() => {
    updateLeaderboard();
  }, 30000);
});

async function updateLeaderboard() {
  try {
    // Query the same collection used on your submission page
    const results = await wixData.query('ClimbScores2').limit(1000).find();

    let totals = {};

    // Group and sum the points
    results.items.forEach((item) => {
      if (item.climberName) {
        if (!totals[item.climberName]) totals[item.climberName] = 0;
        totals[item.climberName] += item.points;
      }
    });

    // Sort by points (highest first) AND bake the rank into the object
    const sortedRows = Object.keys(totals)
      .map((name) => {
        return {
          climber: name,
          score: totals[name],
        };
      })
      .sort((a, b) => b.score - a.score)
      .map((row, index) => {
        return {
          climber: row.climber,
          score: row.score,
          rank: index + 1, // Rank is now officially defined here
        };
      });

    // Send to the HTML component
    $w('#fancyLeaderboard').postMessage(sortedRows);
  } catch (err) {
    console.error('Leaderboard refresh error:', err);
  }
}
