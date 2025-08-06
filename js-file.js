const p = document.createElement("p");
p.textContent = "Hey I'm red!";
p.style.cssText = "color: blue";
document.body.appendChild(p);

/*
Players need to be stored in objects
Object should control the flow of the game itself

The main goal is to have little global code as possible
Try tucking as much as you can inside factories
If you only need a single instance of something (e.g. gamboard, displayController),
then wrap the factory inside an IIFE (module pattern) so it cannot be reused to create additional instances

Think carefully about WHERE each bit of logic should reside.
Each little piece of functionalty should be able to fit in the game, player, or gameboard onjects
Take care to put them in "logcal" places. BRAINSTORM!!!

Step 1! Brainstorm
Step 2! Get a working game in the console
Step 3! Create object that will handle display/DOM logic
Step 4! Write functions that allow players to add marks to specific spot on board
Step 5!Clean up internface to allow players to put their inames, include start/restart game, and add display element that shows a results upon game end!!!