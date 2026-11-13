
// =====================================
// 1. НАЛАШТУВАННЯ ЛИСТІВКИ
// =====================================

// Заміни дату на справжню дату народження.
// Формат: РІК-МІСЯЦЬ-ДЕНЬ

const BIRTH_DATE = "1984-11-09";

// Пароль автоматично береться з року народження.

const BIRTH_YEAR = BIRTH_DATE.slice(0, 4);


// Текст основного привітання.

const GREETING_TEXT =
    "Бажаю вам безмежного щастя, здійснення найзаповітніших мрій, яскравих моментів, щирих усмішок та людей поруч, які роблять кожен день особливим. Нехай усе задумане обов'язково здійсниться!";


// =====================================
// 2. ЗНАХОДИМО HTML-ЕЛЕМЕНТИ
// =====================================

const introScreen = document.querySelector("#introScreen");

const cakeButton = document.querySelector("#cakeButton");

const cakeIcon = document.querySelector(".cake-icon");

const passwordForm = document.querySelector("#passwordForm");

const birthYearInput = document.querySelector("#birthYear");

const errorMessage = document.querySelector("#errorMessage");

const greeting = document.querySelector("#greeting");

const greetingText = document.querySelector("#greetingText");


// =====================================
// 3. АНІМАЦІЯ ТОРТИКА
// =====================================

cakeIcon.addEventListener("animationend", function() {
    cakeIcon.classList.add("floating");
});


// Натискання на торт.

cakeButton.addEventListener("click", function() {

    passwordForm.hidden = false;

    passwordForm.scrollIntoView({ behavior: "smooth", block: "center" });

    cakeButton.querySelector(".tap-hint").textContent =
        "Тепер введіть секретний код";

    cakeButton.disabled = true;

    birthYearInput.focus();

});


// =====================================
// 4. ВВЕДЕННЯ ПАРОЛЯ
// =====================================

// Дозволяємо тільки цифри.

birthYearInput.addEventListener("input", function() {

    birthYearInput.value =
        birthYearInput.value.replace(/\D/g, "").slice(0, 4);

    errorMessage.textContent = "";

});


// Перевірка пароля.

passwordForm.addEventListener("submit", function(event) {

    event.preventDefault();

    if (birthYearInput.value === BIRTH_YEAR) {

        // Ховаємо перший екран.

        introScreen.hidden = true;
        passwordForm.hidden = true;

        // Відкриваємо привітання.

        greeting.hidden = false;

        greeting.classList.add("revealed");

        // Запускаємо ефекти.

        startConfetti();

        typeGreeting();

        calculateDays();

    } else {

        errorMessage.textContent =
            "Неправильний рік. Спробуйте ще раз!";

        birthYearInput.value = "";

        birthYearInput.focus();

    }

});


// =====================================
// 5. АНІМАЦІЯ ДРУКУ ТЕКСТУ
// =====================================

function typeGreeting() {

    let index = 0;

    greetingText.textContent = "";

    const typing = setInterval(function() {

        greetingText.textContent += GREETING_TEXT[index];

        index++;

        if (index >= GREETING_TEXT.length) {
            clearInterval(typing);
        }

    }, 35);

}


// =====================================
// 6. КОНФЕТІ
// =====================================

function startConfetti() {

    const canvas = document.querySelector("#confettiCanvas");

    const ctx = canvas.getContext("2d");

    if (!ctx) return;

    const width = window.innerWidth;
    const height = window.innerHeight;

    const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);

    canvas.width = width * pixelRatio;
    canvas.height = height * pixelRatio;

    ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);

    const colors = [
        "#75c8bd",
        "#ffffff",
        "#e8c879",
        "#a4b9d9",
        "#e9a6bd"
    ];

    const particles = [];

    for (let i = 0; i < 150; i++) {

        particles.push({

            x: Math.random() * width,
            y: Math.random() * -height,

            size: Math.random() * 7 + 3,

            speed: Math.random() * 3 + 2,

            rotation: Math.random() * 360,

            rotationSpeed: Math.random() * 8 - 4,

            color: colors[
                Math.floor(Math.random() * colors.length)
            ]

        });

    }

    const startTime = performance.now();

    function animate(now) {

        ctx.clearRect(0, 0, width, height);

        particles.forEach(function(p) {

            p.y += p.speed;
            p.x += Math.sin(p.y * 0.01) * 1.5;

            p.rotation += p.rotationSpeed;

            ctx.save();

            ctx.translate(p.x, p.y);
            ctx.rotate(p.rotation * Math.PI / 180);

            ctx.fillStyle = p.color;

            ctx.fillRect(
                -p.size / 2,
                -p.size / 2,
                p.size,
                p.size * 0.65
            );

            ctx.restore();

        });

        if (now - startTime < 4500) {
            requestAnimationFrame(animate);
        } else {
            ctx.clearRect(0, 0, width, height);
        }

    }

    requestAnimationFrame(animate);

}


// =====================================
// 7. ФОНОВІ ЗІРОЧКИ ТА СЕРДЕЧКА
// =====================================

function createParticles() {

    const container = document.querySelector("#particles");

    const symbols = ["✦", "✧", "♡", "·", "⋆"];

    for (let i = 0; i < 30; i++) {

        const particle = document.createElement("span");

        particle.className = "particle";

        particle.textContent =
            symbols[Math.floor(Math.random() * symbols.length)];

        particle.style.left = Math.random() * 100 + "%";

        particle.style.animationDuration =
            (10 + Math.random() * 15) + "s";

        particle.style.animationDelay =
            (-Math.random() * 20) + "s";

        particle.style.fontSize =
            (10 + Math.random() * 18) + "px";

        container.appendChild(particle);

    }

}

createParticles();


// =====================================
// 8. ЛІЧИЛЬНИК ПРОЖИТИХ ДНІВ
// =====================================

function calculateDays() {

    const counter = document.querySelector("#daysCounter");

    const parts = BIRTH_DATE.split("-").map(Number);

    const birth = Date.UTC(
        parts[0],
        parts[1] - 1,
        parts[2]
    );

    const today = new Date();

    const current = Date.UTC(
        today.getFullYear(),
        today.getMonth(),
        today.getDate()
    );

    const difference = Math.floor(
        (current - birth) / 86400000
    );

    if (
        parts.length !== 3 ||
        !Number.isFinite(birth) ||
        difference < 0
    ) {
        counter.textContent = "—";
        return;
    }

    counter.textContent =
        difference.toLocaleString("uk-UA");

}


// =====================================
// 9. ВИПАДКОВІ ПОБАЖАННЯ
// =====================================

const wishes = [

    "Нехай кожен день приносить щось хороше!",

    "Бажаю багато щирих усмішок та щасливих моментів!",

    "Нехай усі ваші мрії знаходять шлях до здійснення!",

    "Більше подорожей, пригод та незабутніх спогадів!",

    "Нехай поруч завжди будуть правильні люди!",

    "Бажаю натхнення, сил та впевненості у собі!",

    "Нехай життя буде сповнене приємних несподіванок!"

];


const wishButton = document.querySelector("#wishButton");

const wishText = document.querySelector("#wishText");


wishButton.addEventListener("click", function() {

    const randomIndex = Math.floor(Math.random() * wishes.length);

    wishText.style.opacity = "0";

    setTimeout(function() {

        wishText.textContent = wishes[randomIndex];

        wishText.style.opacity = "1";

    }, 200);

});


// =====================================
// 10. ПОДАРУНОК
// =====================================

const giftButton = document.querySelector("#giftButton");

const giftMessage = document.querySelector("#giftMessage");


giftButton.addEventListener("click", function() {

    giftMessage.hidden = !giftMessage.hidden;

    giftButton.classList.toggle("open");

    if (giftMessage.hidden) {

        giftButton.querySelector("span:last-child").textContent =
            "Відкрити подарунок";

        giftButton.querySelector("#giftIcon").textContent = "🎁";

    } else {

        giftButton.querySelector("span:last-child").textContent =
            "Закрити подарунок";

        giftButton.querySelector("#giftIcon").textContent = "🎉";

        startConfetti();

    }

});


// =====================================
// 11. МУЗИКА
// =====================================

const music = document.querySelector("#music");

const musicButton = document.querySelector("#musicButton");

const volumeSlider = document.querySelector("#volumeSlider");

const musicStatus = document.querySelector("#musicStatus");


// Початкова гучність.

music.volume = 0.5;


// Увімкнення та вимкнення музики.

musicButton.addEventListener("click", async function() {

    if (music.paused) {

        try {

            await music.play();

            musicButton.textContent = "❚❚ Вимкнути музику";

            musicStatus.textContent = "Музика грає 🎵";

        } catch (error) {

            musicStatus.textContent =
                "Не вдалося відтворити. Перевірте файл music.mp3.";

        }

    } else {

        music.pause();

        musicButton.textContent = "▶ Увімкнути музику";

        musicStatus.textContent = "Музику призупинено";

    }

});


// Регулювання гучності.

volumeSlider.addEventListener("input", function() {

    music.volume = Number(volumeSlider.value);

});


// =====================================
// 12. ЛИСТ У КОНВЕРТІ
// =====================================

const envelopeButton = document.querySelector("#envelopeButton");

const letterContent = document.querySelector("#letterContent");


envelopeButton.addEventListener("click", function() {

    letterContent.hidden = !letterContent.hidden;

    envelopeButton.classList.toggle("open");

    if (letterContent.hidden) {

        envelopeButton.querySelector("span:last-child").textContent =
            "Відкрити лист";

        envelopeButton.querySelector("#envelopeIcon").textContent = "💌";

    } else {

        envelopeButton.querySelector("span:last-child").textContent =
            "Закрити лист";

        envelopeButton.querySelector("#envelopeIcon").textContent = "💖";

    }

});


// =====================================
// 13. СЕКРЕТНИЙ СЮРПРИЗ
// =====================================

const secretButton = document.querySelector("#secretButton");

const secretMessage = document.querySelector("#secretMessage");


secretButton.addEventListener("click", function() {

    secretMessage.hidden = !secretMessage.hidden;

    if (secretMessage.hidden) {

        secretButton.textContent = "Секретний сюрприз";

    } else {

        secretButton.textContent = "Приховати сюрприз";

        startConfetti();

    }

});
