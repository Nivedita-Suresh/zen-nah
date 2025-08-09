document.addEventListener('DOMContentLoaded', () => {
    const ball = document.getElementById('ball');
    const path = document.getElementById('sine-path');
    const instr = document.getElementById('breathing-instruction');
    const svg = document.getElementById('breathing-svg');
    const chaosMsg = document.getElementById('chaos-message');

    const width = 1000, height = 200;
    let amp = 70, freq = 2;
    let chaos = false;
    let chaosTriggeredAt = 0;

    const uselessFactDiv = document.getElementById('useless-fact');
        const uselessFacts = [
            "Bananas are berries, but strawberries aren't.",
            "A group of flamingos is called a 'flamboyance'.",
            "Honey never spoils. Archaeologists have eaten 3000-year-old honey.",
            "Octopuses have three hearts.",
            "The unicorn is the national animal of Scotland.",
            "Wombat poop is cube-shaped.",
            "There are more fake flamingos in the world than real ones.",
            "A cloud can weigh more than a million pounds.",
            "The dot over the letter 'i' is called a tittle.",
            "You can't hum while holding your nose closed."
        ];

        // Show a random fact on page load
        const fact = uselessFacts[Math.floor(Math.random() * uselessFacts.length)];
        uselessFactDiv.textContent = fact;

      // Style it directly with JS
        uselessFactDiv.style.color = "#7e1054"; // pink color
        uselessFactDiv.style.fontFamily = "'Comic Sans MS', cursive, sans-serif"; // fun font
        uselessFactDiv.style.fontSize = "1.5rem"; // bigger text
        uselessFactDiv.style.fontWeight = "bold"; // make it bold

    function makePath(offset=0) {
        let d = 'M0 ' + (height/2);
        const pts = 200;
        for (let i = 0; i <= pts; i++) {
            const x = (i/pts)*width;
            const y = height/2 - Math.sin((i/pts)*freq*2*Math.PI + offset)*amp;
            d += ` L${x} ${y}`;
        }
        return d;
    }

    let start = null, offset = 0;
    let lastY = height / 2;
    let currentSpeed = 0.01;

    function getRandomSpeed() {
        return 0.005 + Math.random() * 0.015;
    }

    function step(ts) {
        if (!start) start = ts;
        const elapsed = ts - start;

        if (Math.floor(elapsed / 15000) !== chaosTriggeredAt) {
            chaosTriggeredAt = Math.floor(elapsed / 15000);
            chaos = !chaos;

            if (chaos) {
                chaosMsg.style.opacity = 1;
            } else {
                chaosMsg.style.opacity = 0;
            }
        }

        if (chaos) {
            amp = 70 + Math.sin(ts / 200) * 20; 
            freq = 2 + Math.sin(ts / 1500) * 1; 
            currentSpeed = getRandomSpeed();
        } else {
            amp = 70;
            freq = 2;
            currentSpeed = 0.01;
        }
        
        offset += currentSpeed;  
        path.setAttribute('d', makePath(offset));

        const ballX = width / 2;
        const yPosition = height / 2 - Math.sin((ballX / width) * freq * 2 * Math.PI + offset) * amp;
        
        const svgBox = svg.getBoundingClientRect();
        const newY = (yPosition / height * svgBox.height);
        ball.style.top = newY + 'px';

        const diff = yPosition - lastY;
        let cue;
        if (Math.abs(diff) < 0.1) {
            cue = chaos ? 'CHAOS' : 'HOLD';
        } else if (diff < 0) {
            cue = 'BREATHE IN';
        } else {
            cue = 'BREATHE OUT';
        }
        
        instr.textContent = cue;
        lastY = yPosition;
        
        requestAnimationFrame(step);
    }

    requestAnimationFrame(step);
});
