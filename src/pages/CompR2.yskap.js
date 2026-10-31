import { local } from 'wix-storage';
import wixData from 'wix-data';

// --- MAIN PAGE LOGIC ---
$w.onReady(function () {
  // 1. Remember the climber's name from their phone
  const savedName = local.getItem('climberName');
  if (savedName) {
    $w('#nameInput').value = savedName;
  }

  // 2. Load the Leaderboard table on start
  updateLeaderboard();

  // 3. Handle the Submission Button
  $w('#submitBtn').onClick(async () => {
    const name = $w('#nameInput').value.trim();
    const routeValue = $w('#routeDropdown').value;
    const result = $w('#resultDropdown').value;

    // Validation: Ensure all fields are selected
    if (!name || !routeValue || !result) {
      showMessage('Please fill in all fields!', 'red');
      return;
    }

    const route = Number(routeValue);
    $w('#submitBtn').disable();
    showMessage('Saving your progress...', 'orange');

    // 4. Point Logic (Non-cumulative: Start=1, Zone1=5, Zone2=10, Top=25)
    let pts = 0;
    if (result === 'Top') pts = 25;
    else if (result === 'Zone 2') pts = 10;
    else if (result === 'Zone 1') pts = 5;
    else if (result === 'Start') pts = 1;

    try {
      // 5. Check if this climber has already logged this route
      const existing = await wixData
        .query('ClimbScores2')
        .eq('climberName', name)
        .eq('routeNumber', route)
        .find();

      if (existing.items.length > 0) {
        const oldEntry = existing.items[0];

        // Update only if the new score is an improvement
        if (pts > oldEntry.points) {
          oldEntry.result = result;
          oldEntry.points = pts;
          await wixData.update('ClimbScores2', oldEntry);
          showMessage(`🔥 Updated to ${result}!`, 'green');
        } else {
          showMessage(`⚠️ You already have ${oldEntry.result} (or better).`, 'red');
        }
      } else {
        // 6. Brand new route log for this climber
        await wixData.insert('ClimbScores2', {
          climberName: name,
          routeNumber: route,
          result: result,
          points: pts,
        });
        showMessage(`✅ ${result} on Route #${route} recorded!`, 'green');
      }

      // Clean up UI
      local.setItem('climberName', name); // Save name for next time
      $w('#routeDropdown').value = null; // Clear route for next log
      updateLeaderboard(); // Refresh the table
    } catch (err) {
      console.error(err);
      showMessage('Error! Check DB permissions.', 'red');
    }

    $w('#submitBtn').enable();
  });
});

// --- HELPER FUNCTIONS ---

/**
 * Displays status alerts to the user
 */
function showMessage(text, color) {
  const msg = $w('#statusMsg');
  msg.text = text;
  if (color === 'red') msg.style.color = '#FF4D4D';
  else if (color === 'green') msg.style.color = '#2ECC71';
  else msg.style.color = '#FFA500'; // Orange
  msg.show();
}

/**
 * Calculates total scores and updates the leaderboard table
 */
async function updateLeaderboard() {
  try {
    const results = await wixData.query('ClimbScores2').limit(1000).find();
    let totals = {};

    // Sum points per climber
    results.items.forEach((item) => {
      if (item.climberName) {
        if (!totals[item.climberName]) totals[item.climberName] = 0;
        totals[item.climberName] += item.points;
      }
    });

    // Convert totals into rows, sort by points (highest first)
    const sortedRows = Object.keys(totals)
      .map((name) => {
        return {
          climber: name,
          score: totals[name],
        };
      })
      .sort((a, b) => b.score - a.score);

    // Map to table (Ensure column keys are 'climber' and 'score')
    $w('#leaderboardTable').rows = sortedRows;
  } catch (e) {
    console.error('Leaderboard error:', e);
  }
}
