# [Bubble-Trader](https://bubbletraderserver20250122211424.azurewebsites.net/)
In this project I attempt to recreate a stock market using random agents as traders. The goal is to build a game that simulates day trading as realistically as possible.

### [Built on the React Game Loop](https://github.com/TheFreck/ReactGameLoop)
I built this on top of the game loop I already made in React. It consists of a LoopContainer which houses a LoopMechanism which contains the setInterval function and the march function which the interval calls.

The LoopContainer also contains a loopRef which uses the react.useRef() hook to store all the game data.

### loopHelpers
loopHelpers.jsx is a static file that handles all the calculations that need to happen each time the loop runs. In addition it also holds the creater functions to create the bubbles that bounce around the screen.
