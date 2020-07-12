const elements = {
    cardsContainer: document.getElementById("cards-container"),
    prevBtn: document.getElementById("prev"),
    nextBtn: document.getElementById("next"),
    currentDomCard: document.getElementById("current"),
    showBtn: document.getElementById("show"),
    hideBtn: document.getElementById("hide"),
    domQuestion: document.getElementById("question"),
    domAnswer: document.getElementById("answer"),
    addCardBtn: document.getElementById("add-card"),
    clearBtn: document.getElementById("clear"),
    addContainer: document.getElementById("add-container"),
    navigationContainer: document.querySelector(".navigation"),
};

let currentActiveCard = 0;

let cards = [];

const createCard = ({ question, answer }) => {
    let markup = `
        <div class="card">
            <div class="inner-card">
                <div class="inner-card-front"><p>${question}</p></div>

                <div class="inner-card-back"><p>${answer}</p></div>
            </div>
        </div>
    `;

    elements.cardsContainer.insertAdjacentHTML("beforeend", markup);
};

let timeout;
const navigateCards = (domCards, cls) => {
    domCards.forEach(domCard => domCard.classList.remove(cls, "active"));

    domCards[currentActiveCard].classList.add(cls, "active");

    timeout && clearTimeout(timeout);

    timeout = setTimeout(_ => domCards[currentActiveCard].classList.remove(cls), 450);
};

const getLocalCards = _ => {
    cards.push(...(JSON.parse(localStorage.getItem("cards")) || []));

    if (!cards.length) return;

    cards?.forEach(createCard);

    document.querySelector(".cards .card")?.classList.add("active");

    elements.currentDomCard.textContent = `${currentActiveCard + 1}/${cards.length}`;
};

elements.showBtn.addEventListener("click", _ => elements.addContainer.classList.add("show"));

elements.cardsContainer.addEventListener("click", ({ target }) =>
    target.closest(".card")?.classList.toggle("show-answer"),
);

elements.addContainer.addEventListener("click", ({ currentTarget: addContainer, target }) => {
    const { hideBtn, domQuestion, domAnswer, addCardBtn } = elements;

    if (target.matches(`#${hideBtn.id}`)) return addContainer.classList.remove("show");

    const newCard = { question: domQuestion.value.trim(), answer: domAnswer.value.trim() };

    if (!target.matches(`#${addCardBtn.id}`) || !newCard.question || !newCard.answer) return;

    cards.push(newCard);

    createCard(newCard);

    localStorage.setItem("cards", JSON.stringify(cards));

    document.querySelector(".card")?.classList.add("active");

    addContainer.classList.remove("show");

    [domQuestion, domAnswer].forEach(input => (input.value = ""));

    elements.currentDomCard.textContent = `${currentActiveCard + 1}/${cards.length}`;
});

elements.navigationContainer.addEventListener("click", ({ target }) => {
    const { nextBtn, prevBtn, currentDomCard } = elements;

    if (!target.matches(`#${nextBtn.id}, #${prevBtn.id}`)) return;

    const domCards = document.querySelectorAll(".cards .card");

    if (target.matches(`#${nextBtn.id}, #${nextBtn.id} *`) && cards.length > 1) {
        currentActiveCard === domCards.length - 1 ? (currentActiveCard = 0) : currentActiveCard++;

        navigateCards(domCards, "left");
    }

    if (target.matches(`#${prevBtn.id}, #${prevBtn.id} *`) && cards.length > 1) {
        currentActiveCard === 0 ? (currentActiveCard = domCards.length - 1) : currentActiveCard--;

        navigateCards(domCards, "right");
    }

    currentDomCard.textContent = `${currentActiveCard + 1}/${cards.length}`;
});

elements.clearBtn.addEventListener("click", _ => {
    localStorage.clear();
    location.reload();
});

document.addEventListener("DOMContentLoaded", getLocalCards);
